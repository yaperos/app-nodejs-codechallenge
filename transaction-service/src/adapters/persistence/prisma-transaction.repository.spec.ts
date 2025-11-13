import { PrismaService } from '@infra/prisma/prisma.service';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { createPendingTransaction } from '@domain/transaction';
import { OutboxMessage } from '@domain/outbox';
import { Prisma } from '@prisma/client';

describe('PrismaTransactionRepository', () => {
  let prisma: jest.Mocked<PrismaService> & {
    transaction: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    outbox: { create: jest.Mock };
  };
  let repository: PrismaTransactionRepository;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(),
      transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      outbox: {
        create: jest.fn(),
      },
    } as unknown as typeof prisma;

    repository = new PrismaTransactionRepository(prisma);
  });

  it('creates transaction and outbox entry in single transaction', async () => {
    const domainTransaction = createPendingTransaction({
      transactionExternalId: 'ext-1',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 2,
      value: 250,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    const outboxMessage: OutboxMessage = {
      topic: 'transactions.created',
      key: 'ext-1',
      payload: { foo: 'bar' },
      nextAttemptAt: new Date('2025-01-01T00:00:00Z'),
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        transaction: prisma.transaction,
        outbox: prisma.outbox,
      } as unknown as Prisma.TransactionClient;
      return callback(tx);
    });

    prisma.transaction.create.mockResolvedValue({
      transactionExternalId: domainTransaction.transactionExternalId,
      accountExternalIdDebit: domainTransaction.accountExternalIdDebit,
      accountExternalIdCredit: domainTransaction.accountExternalIdCredit,
      transferTypeId: domainTransaction.transferTypeId,
      value: new Prisma.Decimal(domainTransaction.value),
      status: domainTransaction.status,
      createdAt: domainTransaction.createdAt,
    } as any);

    const result = await repository.createWithOutbox(domainTransaction, outboxMessage);

    expect(result).toMatchObject({ transactionExternalId: 'ext-1' });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        transactionExternalId: domainTransaction.transactionExternalId,
        accountExternalIdDebit: domainTransaction.accountExternalIdDebit,
        accountExternalIdCredit: domainTransaction.accountExternalIdCredit,
        transferTypeId: domainTransaction.transferTypeId,
        value: new Prisma.Decimal(domainTransaction.value),
        status: domainTransaction.status,
        createdAt: domainTransaction.createdAt,
      },
    });
    expect(prisma.outbox.create).toHaveBeenCalledWith({
      data: {
        topic: outboxMessage.topic,
        key: outboxMessage.key,
        payload: outboxMessage.payload,
        nextAttemptAt: outboxMessage.nextAttemptAt,
      },
    });
  });

  it('finds transaction by external id', async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      transactionExternalId: 'ext-1',
      accountExternalIdDebit: 'deb-1',
      accountExternalIdCredit: 'cred-1',
      transferTypeId: 2,
      value: new Prisma.Decimal(100),
      status: 'pending',
      createdAt: new Date('2025-01-01T00:00:00Z'),
    } as any);

    const result = await repository.findByExternalId('ext-1');
    expect(result).toMatchObject({ transactionExternalId: 'ext-1', value: 100 });
  });

  it('updates status by delegating to prisma', async () => {
    await repository.updateStatus('ext-1', 'approved');
    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { transactionExternalId: 'ext-1' },
      data: { status: 'approved' },
    });
  });
});
