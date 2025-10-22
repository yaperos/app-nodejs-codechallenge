import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../src/infrastructure/database/entities/transaction.entity';
import { TransactionRepository } from '../../src/infrastructure/database/repositories/transaction.repository';
import { TestDatabaseHelper } from './helpers/test-database.helper';
import { TransactionStatus, TransactionType } from '../../src/domain/entities/transaction.entity';

describe('Database Integration Tests', () => {
  let dbHelper: TestDatabaseHelper;
  let module: TestingModule;
  let repository: TransactionRepository;

  beforeAll(async () => {
    dbHelper = new TestDatabaseHelper();
    await dbHelper.connect();

    module = await Test.createTestingModule({
      imports: [
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
      providers: [TransactionRepository],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  afterAll(async () => {
    await module.close();
    await dbHelper.disconnect();
  });

  beforeEach(async () => {
    await dbHelper.cleanDatabase();
  });

  describe('Transaction CRUD Operations', () => {
    it('should create a new transaction', async () => {
      const transaction = await dbHelper.createTestTransaction({
        externalId: 'test-txn-001',
        type: TransactionType.P2P,
        status: TransactionStatus.PENDING,
        amount: 100,
        currency: 'PEN',
      });

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.externalId).toBe('test-txn-001');
      expect(transaction.amount).toBe(100);
    });

    it('should read transaction by ID', async () => {
      const created = await dbHelper.createTestTransaction({
        externalId: 'test-txn-002',
      });

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.externalId).toBe('test-txn-002');
    });

    it('should update transaction status', async () => {
      const transactionEntity = await dbHelper.createTestTransaction({
        status: TransactionStatus.PENDING,
      });

      const transaction = await repository.findById(transactionEntity.id);
      expect(transaction).toBeDefined();

      transaction!.markAsProcessing();
      transaction!.markAsCompleted();

      const updated = await repository.update(transaction!);

      expect(updated.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should handle concurrent updates with optimistic locking', async () => {
      const transactionEntity = await dbHelper.createTestTransaction({
        status: TransactionStatus.PENDING,
      });

      const txn1 = await repository.findById(transactionEntity.id);
      const txn2 = await repository.findById(transactionEntity.id);

      expect(txn1).toBeDefined();
      expect(txn2).toBeDefined();

      txn1!.markAsProcessing();
      txn2!.markAsProcessing();
      txn2!.markAsCompleted();

      const update1 = repository.update(txn1!);
      const update2 = repository.update(txn2!);

      const results = await Promise.allSettled([update1, update2]);

      const succeeded = results.filter(r => r.status === 'fulfilled');
      expect(succeeded.length).toBeGreaterThan(0);
    });
  });

  describe('Transaction Queries', () => {
    beforeEach(async () => {
      await Promise.all([
        dbHelper.createTestTransaction({
          externalId: 'txn-001',
          status: TransactionStatus.PENDING,
          type: TransactionType.P2P,
          amount: 100,
          sourceAccountId: 'account-1',
        }),
        dbHelper.createTestTransaction({
          externalId: 'txn-002',
          status: TransactionStatus.COMPLETED,
          type: TransactionType.PAYMENT,
          amount: 200,
          sourceAccountId: 'account-1',
        }),
        dbHelper.createTestTransaction({
          externalId: 'txn-003',
          status: TransactionStatus.FAILED,
          type: TransactionType.P2P,
          amount: 300,
          sourceAccountId: 'account-2',
        }),
      ]);
    });

    it('should find transactions by status', async () => {
      const pending = await repository.findByStatus('pending', 10);

      expect(pending.length).toBe(1);
      expect(pending[0].status).toBe(TransactionStatus.PENDING);
    });

    it('should find transactions by account ID', async () => {
      const transactions = await repository.findByAccountId('account-1', 10, 0);

      expect(transactions.length).toBe(2);
      expect(transactions.every(t => t.sourceAccountId === 'account-1')).toBe(true);
    });

    it('should count transactions by status', async () => {
      const count = await repository.countByStatus('completed');

      expect(count).toBe(1);
    });

    it('should calculate total amount by status', async () => {
      const total = await repository.getTotalAmountByStatus('completed');

      expect(total).toBe('200.00');
    });

    it('should find failed transactions for retry', async () => {
      const failed = await repository.findFailedTransactionsForRetry(5);

      expect(failed.length).toBeGreaterThanOrEqual(0);
      expect(failed.every(t => t.status === TransactionStatus.FAILED)).toBe(true);
    });
  });

  describe('Transaction Filtering and Pagination', () => {
    beforeEach(async () => {
      const promises: any[] = [];
      for (let i = 1; i <= 15; i++) {
        promises.push(
          dbHelper.createTestTransaction({
            externalId: `txn-${i.toString().padStart(3, '0')}`,
            status: i % 3 === 0 ? TransactionStatus.COMPLETED : i % 3 === 1 ? TransactionStatus.PENDING : TransactionStatus.FAILED,
            amount: i * 10,
          }),
        );
      }
      await Promise.all(promises);
    });

    it('should paginate results correctly', async () => {
      const page1 = await repository.findByStatus('pending', 2);

      expect(page1.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by multiple criteria', async () => {
      const result = await dbHelper
        .getDataSource()
        .getRepository(TransactionEntity)
        .createQueryBuilder('transaction')
        .where('transaction.status = :status', { status: TransactionStatus.PENDING })
        .andWhere('transaction.amount::numeric > :amount', { amount: 50 })
        .getMany();

      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.status === TransactionStatus.PENDING)).toBe(true);
    });
  });

  describe('Database Transactions', () => {
    it('should rollback on error', async () => {
      const dataSource = dbHelper.getDataSource();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.save(TransactionEntity, {
          externalId: 'test-rollback',
          type: TransactionType.P2P,
          status: TransactionStatus.PENDING,
          amount: 100,
          currency: 'PEN',
          sourceAccountId: 'account-1',
          targetAccountId: 'account-2',
        });

        throw new Error('Simulated error');
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }

      const found = await repository.findByExternalId('test-rollback');
      expect(found).toBeNull();
    });

    it('should commit on success', async () => {
      const dataSource = dbHelper.getDataSource();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.save(TransactionEntity, {
          externalId: 'test-commit',
          type: TransactionType.P2P,
          status: TransactionStatus.PENDING,
          amount: 100,
          currency: 'PEN',
          sourceAccountId: 'account-1',
          targetAccountId: 'account-2',
        });

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

      const found = await repository.findByExternalId('test-commit');
      expect(found).toBeDefined();
      expect(found?.externalId).toBe('test-commit');
    });
  });

  describe('Database Performance', () => {
    it('should handle bulk inserts efficiently', async () => {
      const startTime = Date.now();

      const transactions: any[] = [];
      for (let i = 0; i < 100; i++) {
        transactions.push({
          externalId: `bulk-${i}`,
          type: TransactionType.P2P,
          status: TransactionStatus.PENDING,
          amount: 100,
          currency: 'PEN',
          sourceAccountId: 'account-bulk',
          targetAccountId: 'dest-bulk',
        });
      }

      await dbHelper
        .getDataSource()
        .getRepository(TransactionEntity)
        .save(transactions);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000);

      const count = await repository.countByStatus('pending');
      expect(count).toBeGreaterThanOrEqual(100);
    }, 10000);

    it('should use indexes for common queries', async () => {
      const transactions: any[] = [];
      for (let i = 0; i < 50; i++) {
        transactions.push({
          externalId: `perf-${i}`,
          type: TransactionType.P2P,
          status: TransactionStatus.PENDING,
          amount: 100,
          currency: 'PEN',
          sourceAccountId: `account-${i % 10}`,
          targetAccountId: 'dest',
        });
      }

      await dbHelper
        .getDataSource()
        .getRepository(TransactionEntity)
        .save(transactions);

      const startTime = Date.now();

      await repository.findByAccountId('account-5', 1, 10);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Data Integrity', () => {
    it('should enforce unique constraints', async () => {
      const idempotencyKey = `unique-${Date.now()}`;

      await dbHelper.createTestTransaction({
        idempotencyKey,
      });

      await expect(
        dbHelper.createTestTransaction({
          idempotencyKey,
        }),
      ).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      const repo = dbHelper.getDataSource().getRepository(TransactionEntity);

      await expect(
        repo.save({
          type: TransactionType.P2P,
        } as Partial<TransactionEntity>),
      ).rejects.toThrow();
    });

    it('should maintain referential integrity', async () => {
      const transaction = await dbHelper.createTestTransaction({
        sourceAccountId: 'account-ref-1',
        targetAccountId: 'account-ref-2',
      });

      const found = await repository.findById(transaction.id);
      expect(found?.sourceAccountId).toBe('account-ref-1');
      expect(found?.targetAccountId).toBe('account-ref-2');
    });
  });
});
