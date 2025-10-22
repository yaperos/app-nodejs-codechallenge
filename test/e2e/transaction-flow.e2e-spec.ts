import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as request from 'supertest';
import { TransactionEntity } from '../../src/infrastructure/database/entities/transaction.entity';
import { TransactionController } from '../../src/presentation/controllers/transaction.controller';
import { TransactionService } from '../../src/application/services/transaction.service';
import { TransactionRepository } from '../../src/infrastructure/database/repositories/transaction.repository';
import { TransactionEventService } from '../../src/application/services/transaction-event.service';
import { TransactionStatus, TransactionType } from '../../src/domain/entities/transaction.entity';
import { TestDatabaseHelper } from '../integration/helpers/test-database.helper';

describe('Transaction Flow E2E Tests', () => {
  let app: INestApplication;
  let dbHelper: TestDatabaseHelper;

  beforeAll(async () => {
    dbHelper = new TestDatabaseHelper();
    await dbHelper.connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 1000,
        }]),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME || 'yape_user',
          password: process.env.DB_PASSWORD || 'yape_password123',
          database: process.env.DB_DATABASE || 'yape_transactions',
          entities: [TransactionEntity],
          synchronize: true,
          logging: false,
          extra: {
            max: 5,
            min: 1,
            idleTimeoutMillis: 5000,
          },
        }),
        TypeOrmModule.forFeature([TransactionEntity]),
      ],
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: 'ITransactionRepository',
          useClass: TransactionRepository,
        },
        {
          provide: 'BullQueue_transactions',
          useValue: {
            add: jest.fn().mockResolvedValue({ id: 'job-1' }),
            process: jest.fn(),
          },
        },
        {
          provide: 'BullQueue_antifraud',
          useValue: {
            add: jest.fn().mockResolvedValue({ id: 'job-2' }),
            process: jest.fn(),
          },
        },
        {
          provide: TransactionEventService,
          useValue: {
            publishTransactionCreated: jest.fn(),
            publishTransactionProcessing: jest.fn(),
            publishTransactionCompleted: jest.fn(),
            publishTransactionFailed: jest.fn(),
          },
        },
        {
          provide: 'KAFKA_SERVICE',
          useValue: {
            emit: jest.fn(),
            connect: jest.fn(),
          },
        },
        TransactionRepository,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await dbHelper.disconnect();
  });

  beforeEach(async () => {
    await dbHelper.cleanDatabase();
  });

  describe('Complete P2P Transaction Flow', () => {
    it('should complete full P2P transaction lifecycle', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          externalId: '550e8400-e29b-41d4-a716-446655440000',
          idempotencyKey: 'e2e-p2p-001',
          type: 'P2P',
          amount: 100.50,
          currency: 'PEN',
          sourceAccountId: '+51999888777',
          targetAccountId: '+51999888666',
          metadata: {
            description: 'Pago por cena',
            category: 'food',
          },
        })
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data).toHaveProperty('id');
      const transactionId = createResponse.body.data.id;

      const dbTransaction = await dbHelper.getTransactionById(transactionId);
      expect(dbTransaction).toBeDefined();
      expect(dbTransaction?.status).toBe(TransactionStatus.PENDING);
      expect(Number(dbTransaction?.amount)).toBe(100.50);

      const getResponse = await request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(200);

      expect(getResponse.body.data.id).toBe(transactionId);
      expect(getResponse.body.data.status).toBe(TransactionStatus.PENDING);
      expect(getResponse.body.data.amount).toBe(100.50);

      const listResponse = await request(app.getHttpServer())
        .get('/transactions/status/pending')
        .expect(200);

      const foundTransaction = listResponse.body.data.find(
        (t: { id: string }) => t.id === transactionId
      );
      expect(foundTransaction).toBeDefined();
    });
  });

  describe('Transaction with External ID Lookup', () => {
    it('should create and retrieve transaction by external ID', async () => {
      const externalId = '550e8400-e29b-41d4-a716-446655440011';

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          externalId,
          idempotencyKey: 'e2e-external-001',
          type: 'PAYMENT',
          amount: 250.00,
          currency: 'PEN',
          sourceAccountId: '+51999888111',
          targetAccountId: '+51999888222',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/transactions/external/${externalId}`)
        .expect(200);

      expect(response.body.data.externalId).toBe(externalId);
      expect(response.body.data.type).toBe(TransactionType.PAYMENT);
    });
  });

  describe('Account Transaction History', () => {
    it('should track all transactions for an account', async () => {
      const accountId = '+51999888333';

      for (let i = 1; i <= 3; i++) {
        await request(app.getHttpServer())
          .post('/transactions')
          .send({
            externalId: `550e8400-e29b-41d4-a716-44665544${i.toString().padStart(4, '0')}`,
            idempotencyKey: `e2e-account-${i}`,
            type: 'P2P',
            amount: i * 50,
            currency: 'PEN',
            sourceAccountId: accountId,
            targetAccountId: `+5199988844${i}`,
          })
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get(`/transactions/account/${accountId}`)
        .expect(200);

      expect(response.body.data.length).toBe(3);
      expect(response.body.pagination.count).toBe(3);
    });
  });

  describe('Transaction Reversal Flow', () => {
    it('should reverse a completed transaction', async () => {
      const transaction = await dbHelper.createTestTransaction({
        status: TransactionStatus.COMPLETED,
        type: TransactionType.P2P,
        amount: 150,
        sourceAccountId: '+51999888444',
        targetAccountId: '+51999888555',
      });

      const reverseResponse = await request(app.getHttpServer())
        .post(`/transactions/${transaction.id}/reverse`)
        .send({
          reason: 'Cliente solicitó reversión',
        })
        .expect(200);

      expect(reverseResponse.body.success).toBe(true);
      expect(reverseResponse.body.data).toHaveProperty('reversalTransactionId');
      expect(reverseResponse.body.data.originalTransactionId).toBe(transaction.id);

      const originalTxn = await dbHelper.getTransactionById(transaction.id);
      expect(originalTxn?.status).toBe(TransactionStatus.REVERSED);
    });
  });

  describe('Transaction Statistics Flow', () => {
    it('should provide accurate statistics across transactions', async () => {
      await Promise.all([
        dbHelper.createTestTransaction({
          status: TransactionStatus.COMPLETED,
          amount: 100,
        }),
        dbHelper.createTestTransaction({
          status: TransactionStatus.COMPLETED,
          amount: 200,
        }),
        dbHelper.createTestTransaction({
          status: TransactionStatus.PENDING,
          amount: 50,
        }),
        dbHelper.createTestTransaction({
          status: TransactionStatus.FAILED,
          amount: 75,
        }),
      ]);

      const response = await request(app.getHttpServer())
        .get('/transactions/statistics/summary')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Error Handling Flows', () => {
    it('should handle invalid transaction data gracefully', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          externalId: '550e8400-e29b-41d4-a716-446655440099',
          type: 'P2P',
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return 404 for non-existent transaction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/transactions/${nonExistentId}`)
        .expect(404);
    });

    it('should prevent reversal of non-completed transactions', async () => {
      const transaction = await dbHelper.createTestTransaction({
        status: TransactionStatus.PENDING,
      });

      await request(app.getHttpServer())
        .post(`/transactions/${transaction.id}/reverse`)
        .send({ reason: 'Test' })
        .expect(409);
    });
  });

  describe('Pagination and Filtering', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 15; i++) {
        await dbHelper.createTestTransaction({
          status: i % 3 === 0 ? TransactionStatus.COMPLETED : 
                 i % 3 === 1 ? TransactionStatus.PENDING : 
                 TransactionStatus.FAILED,
          amount: i * 10,
        });
      }
    });

    it('should paginate transaction results correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/status/pending?limit=5')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by status correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/status/completed')
        .expect(200);

      expect(response.body.data.every((t: { status: string }) => t.status === TransactionStatus.COMPLETED)).toBe(true);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous transaction creations', async () => {
      const requests: any[] = [];

      for (let i = 1; i <= 5; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/transactions')
            .send({
              externalId: `550e8400-e29b-41d4-a716-446655444${i.toString().padStart(3, '0')}`,
              idempotencyKey: `e2e-concurrent-${i}`,
              type: 'P2P',
              amount: 100,
              currency: 'PEN',
              sourceAccountId: `+519998885${i.toString().padStart(2, '0')}`,
              targetAccountId: `+519998886${i.toString().padStart(2, '0')}`,
            })
        );
      }

      const responses = await Promise.all(requests);

      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(5);
    });
  });
});
