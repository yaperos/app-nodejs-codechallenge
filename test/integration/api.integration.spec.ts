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
import { TestDatabaseHelper } from './helpers/test-database.helper';
import { TransactionStatus, TransactionType } from '../../src/domain/entities/transaction.entity';

describe('API Integration Tests', () => {
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
            add: jest.fn(),
            process: jest.fn(),
          },
        },
        {
          provide: 'BullQueue_antifraud',
          useValue: {
            add: jest.fn(),
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

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const createDto = {
        externalId: '550e8400-e29b-41d4-a716-446655440001',
        idempotencyKey: 'idempotency-001',
        type: 'P2P',
        amount: 100.00,
        currency: 'PEN',
        sourceAccountId: '+51999888001',
        targetAccountId: '+51999888002',
        metadata: { note: 'Test transaction' },
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(createDto);

      if (response.status !== 201) {
        console.log('Error creating transaction:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.externalId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(response.body.data.status).toBe(TransactionStatus.PENDING);
      expect(response.body.data.amount).toBe(100);
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        externalId: '550e8400-e29b-41d4-a716-446655440002',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(invalidDto)
        .expect(400);
    });

    it.skip('should enforce idempotency', async () => {
      const createDto = {
        externalId: '550e8400-e29b-41d4-a716-446655440003',
        idempotencyKey: 'idempotency-003',
        type: 'P2P',
        amount: 100.00,
        currency: 'PEN',
        sourceAccountId: '+51999888003',
        targetAccountId: '+51999888004',
      };

      const response1 = await request(app.getHttpServer())
        .post('/transactions')
        .send(createDto)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/transactions')
        .send(createDto)
        .expect(409);

      expect(response2.body).toHaveProperty('message');
    });

    it('should validate amount format', async () => {
      const invalidDto = {
        externalId: '550e8400-e29b-41d4-a716-446655440004',
        idempotencyKey: 'idempotency-004',
        type: 'P2P',
        amount: 'invalid-amount',
        currency: 'PEN',
        sourceAccountId: '+51999888005',
        targetAccountId: '+51999888006',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate currency code', async () => {
      const invalidDto = {
        externalId: '550e8400-e29b-41d4-a716-446655440005',
        idempotencyKey: 'idempotency-005',
        type: 'P2P',
        amount: 100.00,
        currency: 'INVALID',
        sourceAccountId: '+51999888007',
        targetAccountId: '+51999888008',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /transactions/:id', () => {
    it('should retrieve transaction by ID', async () => {
      const transaction = await dbHelper.createTestTransaction({
        externalId: 'api-test-get-001',
        type: TransactionType.P2P,
        status: TransactionStatus.COMPLETED,
        amount: 100,
      });

      const response = await request(app.getHttpServer())
        .get(`/transactions/${transaction.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(transaction.id);
      expect(response.body.data.externalId).toBe('api-test-get-001');
      expect(response.body.data.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should return 404 for non-existent transaction', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/transactions/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/transactions/invalid-uuid')
        .expect(400);
    });
  });

  describe('GET /transactions/status/:status', () => {
    beforeEach(async () => {
      await Promise.all([
        dbHelper.createTestTransaction({
          externalId: 'list-001',
          status: TransactionStatus.PENDING,
          type: TransactionType.P2P,
          amount: 100,
        }),
        dbHelper.createTestTransaction({
          externalId: 'list-002',
          status: TransactionStatus.COMPLETED,
          type: TransactionType.PAYMENT,
          amount: 200,
        }),
        dbHelper.createTestTransaction({
          externalId: 'list-003',
          status: TransactionStatus.PENDING,
          type: TransactionType.P2P,
          amount: 300,
        }),
      ]);
    });

    it('should list transactions by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/status/pending')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.every((t: { status: string }) => t.status === TransactionStatus.PENDING)).toBe(true);
    });

    it('should filter transactions by completed status', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/status/completed')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.every((t: { status: string }) => t.status === TransactionStatus.COMPLETED)).toBe(true);
    });

    it('should paginate results', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/status/pending?limit=1')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should get statistics summary', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const response = await request(app.getHttpServer())
        .get(`/transactions/statistics/summary?startDate=${yesterday.toISOString()}&endDate=${now.toISOString()}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /transactions/:id/reverse', () => {
    it('should reverse a completed transaction', async () => {
      const transaction = await dbHelper.createTestTransaction({
        status: TransactionStatus.COMPLETED,
        type: TransactionType.P2P,
        amount: 100,
      });

      const response = await request(app.getHttpServer())
        .post(`/transactions/${transaction.id}/reverse`)
        .send({ reason: 'Customer request' })
        .expect(200);

      expect(response.body.data).toHaveProperty('reversalTransactionId');
      expect(response.body.data.originalTransactionId).toBe(transaction.id);
      expect(response.body.data.amount).toBe(100);
    });

    it('should not reverse non-completed transaction', async () => {
      const transaction = await dbHelper.createTestTransaction({
        status: TransactionStatus.PENDING,
      });

      await request(app.getHttpServer())
        .post(`/transactions/${transaction.id}/reverse`)
        .send({ reason: 'Test' })
        .expect(409);
    });

    it('should not reverse already reversed transaction', async () => {
      const transaction = await dbHelper.createTestTransaction({
        status: TransactionStatus.REVERSED,
      });

      await request(app.getHttpServer())
        .post(`/transactions/${transaction.id}/reverse`)
        .send({ reason: 'Test' })
        .expect(409);
    });
  });

  describe('Error Handling', () => {
    it.skip('should return 500 for database errors', async () => {
      await dbHelper.disconnect();

      await request(app.getHttpServer())
        .get('/transactions/status/pending')
        .expect(500);

      await dbHelper.connect();
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should reject unknown fields', async () => {
      const dto = {
        externalId: '550e8400-e29b-41d4-a716-446655440010',
        idempotencyKey: 'test-unknown-fields',
        type: 'P2P',
        amount: 100,
        currency: 'PEN',
        sourceAccountId: '+51999888010',
        targetAccountId: '+51999888011',
        unknownField: 'should be rejected',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(dto)
        .expect(400);
    });
  });

  describe('Content Negotiation', () => {
    it('should return JSON by default', async () => {
      const transaction = await dbHelper.createTestTransaction();

      const response = await request(app.getHttpServer())
        .get(`/transactions/${transaction.id}`)
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should accept JSON content type', async () => {
      const dto = {
        externalId: '550e8400-e29b-41d4-a716-446655440020',
        idempotencyKey: 'content-test',
        type: 'P2P',
        amount: 100,
        currency: 'PEN',
        sourceAccountId: '+51999888020',
        targetAccountId: '+51999888021',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .set('Content-Type', 'application/json')
        .send(dto)
        .expect(201);
    });
  });

  describe('Rate Limiting and Security', () => {
    it('should handle concurrent requests', async () => {
      const requests: any[] = [];

      for (let i = 0; i < 10; i++) {
        const uuid = `550e8400-e29b-41d4-a716-4466554400${i.toString().padStart(2, '0')}`;
        requests.push(
          request(app.getHttpServer())
            .post('/transactions')
            .send({
              externalId: uuid,
              idempotencyKey: `concurrent-${i}`,
              type: 'P2P',
              amount: 100,
              currency: 'PEN',
              sourceAccountId: `+519998880${i.toString().padStart(2, '0')}`,
              targetAccountId: `+519998881${i.toString().padStart(2, '0')}`,
            }),
        );
      }

      const responses = await Promise.all(requests);

      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(10);
    });

    it('should sanitize error messages', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/invalid-id')
        .expect(400);

      expect(response.body.message).toBeDefined();
      expect(response.body.message).not.toContain('SQL');
      expect(response.body.message).not.toContain('database');
    });
  });

  describe('Performance', () => {
    it('should handle bulk transaction creation', async () => {
      const requests: any[] = [];

      for (let i = 0; i < 10; i++) {
        const uuid = `550e8400-e29b-41d4-a716-4466554402${i.toString().padStart(2, '0')}`;
        requests.push(
          request(app.getHttpServer())
            .post('/transactions')
            .send({
              externalId: uuid,
              idempotencyKey: `bulk-${i}`,
              type: 'P2P',
              amount: 100,
              currency: 'PEN',
              sourceAccountId: `+519998882${i.toString().padStart(2, '0')}`,
              targetAccountId: `+519998883${i.toString().padStart(2, '0')}`,
            }),
        );
      }

      const startTime = Date.now();
      await Promise.all(requests);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3000);
    }, 10000);

    it('should respond quickly for simple queries', async () => {
      const transaction = await dbHelper.createTestTransaction();

      const startTime = Date.now();
      await request(app.getHttpServer())
        .get(`/transactions/${transaction.id}`)
        .expect(200);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(100);
    });
  });
});
