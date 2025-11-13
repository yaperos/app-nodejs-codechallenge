import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { Transaction, TransactionStatus } from '@domain/transaction';
import { OutboxMessage } from '@domain/outbox';
import { TRANSACTION_REPOSITORY, OUTBOX_REPOSITORY, EVENT_PUBLISHER } from '@ports/tokens';
import { PrismaService } from '@infra/prisma/prisma.service';
import { OutboxPublisher } from '@infra/outbox/outbox.publisher';
import { KafkaEventPublisher } from '@adapters/messaging/kafka-event.publisher';
import { StatusChangedConsumer } from '@adapters/messaging/status.consumer';
import { KafkaSetupService } from '@adapters/messaging/setup.service';
import { TRANSACTIONS_CREATED_TOPIC } from '@adapters/messaging/constants';

class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, Transaction>();
  public readonly outboxMessages: OutboxMessage[] = [];

  async createWithOutbox(transaction: Transaction, outbox: OutboxMessage): Promise<Transaction> {
    const stored = this.cloneTransaction(transaction);
    this.transactions.set(stored.transactionExternalId, stored);
    this.outboxMessages.push({
      ...outbox,
      payload: { ...(outbox.payload ?? {}) },
      nextAttemptAt: outbox.nextAttemptAt ? new Date(outbox.nextAttemptAt) : new Date(),
    });
    return this.cloneTransaction(stored);
  }

  async findByExternalId(transactionExternalId: string): Promise<Transaction | null> {
    const found = this.transactions.get(transactionExternalId);
    return found ? this.cloneTransaction(found) : null;
  }

  async updateStatus(transactionExternalId: string, status: TransactionStatus): Promise<void> {
    const found = this.transactions.get(transactionExternalId);
    if (found) {
      this.transactions.set(transactionExternalId, { ...found, status });
    }
  }

  private cloneTransaction(transaction: Transaction): Transaction {
    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
    };
  }
}

describe('Transactions API (e2e)', () => {
  let app: INestApplication;
  let repository: InMemoryTransactionRepository;

  beforeAll(async () => {
    repository = new InMemoryTransactionRepository();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .overrideProvider(TRANSACTION_REPOSITORY)
      .useValue(repository)
      .overrideProvider(OUTBOX_REPOSITORY)
      .useValue({
        enqueue: jest.fn(),
        dequeueBatch: jest.fn(),
        markPublished: jest.fn(),
        markFailed: jest.fn(),
        withGlobalAdvisoryLock: jest.fn().mockResolvedValue(null),
      })
      .overrideProvider(EVENT_PUBLISHER)
      .useValue({
        publishOutboxMessage: jest.fn(),
        publishStatusChanged: jest.fn(),
      })
      .overrideProvider(OutboxPublisher)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .overrideProvider(KafkaEventPublisher)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        publishOutboxMessage: jest.fn(),
        publishStatusChanged: jest.fn(),
      })
      .overrideProvider(StatusChangedConsumer)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .overrideProvider(KafkaSetupService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a transaction and enqueues an outbox message', async () => {
    const createPayload = {
      accountExternalIdDebit: '11111111-1111-1111-1111-111111111111',
      accountExternalIdCredit: '22222222-2222-2222-2222-222222222222',
      tranferTypeId: 1,
      value: 250,
    };

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send(createPayload)
      .expect(201);

    expect(response.body).toMatchObject({
      transactionStatus: { name: 'pending' },
    });

    const transactionId: string = response.body.transactionExternalId;
    const stored = await repository.findByExternalId(transactionId);
    expect(stored).not.toBeNull();
    expect(stored?.value).toBe(250);
    expect(repository.outboxMessages).toHaveLength(1);
    expect(repository.outboxMessages[0]).toMatchObject({
      topic: TRANSACTIONS_CREATED_TOPIC,
      key: transactionId,
    });

    await request(app.getHttpServer())
      .get(`/transactions/${transactionId}`)
      .expect(200)
      .expect(({ body }: Response['body']) => {
        expect(body.transactionExternalId).toBe(transactionId);
        expect(body.transactionStatus.name).toBe('pending');
        expect(body.value).toBe(250);
      });
  });
});
