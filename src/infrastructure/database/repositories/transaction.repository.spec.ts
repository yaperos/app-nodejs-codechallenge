import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { Transaction, TransactionStatus, TransactionType } from '../../../domain/entities/transaction.entity';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<TransactionEntity>>;
  let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<TransactionEntity>>;

  const createMockEntity = (data: Partial<TransactionEntity>): TransactionEntity => {
    return {
      ...data,
      convertAmountToNumber: jest.fn(),
    } as TransactionEntity;
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getOne: jest.fn().mockResolvedValue(null),
      getCount: jest.fn().mockResolvedValue(0),
      getRawOne: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<SelectQueryBuilder<TransactionEntity>>;

    mockTypeOrmRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      manager: {
        query: jest.fn(),
        getRepository: jest.fn(),
      },
    } as unknown as jest.Mocked<Repository<TransactionEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a new transaction', async () => {
      const transaction = new Transaction({
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src-acc',
        targetAccountId: 'tgt-acc',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
      });

      const savedEntity = createMockEntity({
        id: 'generated-id',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src-acc',
        targetAccountId: 'tgt-acc',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.save.mockResolvedValue(savedEntity);

      const result = await repository.save(transaction);

      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.id).toBe('generated-id');
      expect(result.externalId).toBe('ext-123');
    });

    it('should convert domain model to entity correctly', async () => {
      const transaction = new Transaction({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.PAYMENT,
        amount: 250.50,
        currency: 'USD',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.COMPLETED,
        metadata: { key: 'value' },
        antifraudScore: 25,
        antifraudStatus: 'APPROVED',
        retryCount: 0,
      });

      mockTypeOrmRepository.save.mockImplementation(async (entity) => entity as TransactionEntity);

      await repository.save(transaction);

      const savedEntity = mockTypeOrmRepository.save.mock.calls[0][0];
      expect(savedEntity.id).toBe('txn-123');
      expect(savedEntity.amount).toBe(250.50);
      expect(savedEntity.antifraudScore).toBe(25);
    });
  });

  describe('findById', () => {
    it('should find transaction by id', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('txn-123');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'txn-123' },
      });
      expect(result).not.toBeNull();
      expect(result?.id).toBe('txn-123');
    });

    it('should return null when transaction not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('should convert entity to domain model correctly', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: { test: 'data' },
        antifraudScore: 30,
        antifraudStatus: 'APPROVED',
        antifraudCheckedAt: null,
        retryCount: 0,
        idempotencyKey: null,
        completedAt: null,
        failureReason: null,
        reversedAt: null,
        reversalTransactionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('txn-123');

      expect(result?.antifraudScore).toBe(30);
      expect(result?.metadata).toEqual({ test: 'data' });
    });
  });

  describe('findByExternalId', () => {
    it('should find transaction by external id', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        externalId: 'ext-456',
        type: TransactionType.P2P,
        amount: 100,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findByExternalId('ext-456');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { externalId: 'ext-456' },
      });
      expect(result?.externalId).toBe('ext-456');
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByExternalId('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByIdempotencyKey', () => {
    it('should find transaction by idempotency key', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        idempotencyKey: 'idem-key-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findByIdempotencyKey('idem-key-123');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'idem-key-123' },
      });
      expect(result?.idempotencyKey).toBe('idem-key-123');
    });
  });

  describe('findByAccountId', () => {
    it('should find transactions by source account id', async () => {
      const entities = [
        createMockEntity({
          id: 'txn-1',
          sourceAccountId: 'acc-123',
          targetAccountId: 'other',
          externalId: 'ext-1',
          type: TransactionType.P2P,
          amount: 100,
          status: TransactionStatus.COMPLETED,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockQueryBuilder.getMany.mockResolvedValue(entities);

      const result = await repository.findByAccountId('acc-123');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(transaction.sourceAccountId = :accountId OR transaction.targetAccountId = :accountId)',
        { accountId: 'acc-123' }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('transaction.createdAt', 'DESC');
      expect(result).toHaveLength(1);
    });

    it('should respect limit parameter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await repository.findByAccountId('acc-123', 50);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(50);
    });

    it('should respect offset parameter', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await repository.findByAccountId('acc-123', 100, 20);

      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(20);
    });

    it('should use default limit of 100', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await repository.findByAccountId('acc-123');

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(100);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
    });
  });

  describe('findByStatus', () => {
    it('should find transactions by status', async () => {
      const entities = [
        createMockEntity({
          id: 'txn-1',
          status: TransactionStatus.PENDING,
          externalId: 'ext-1',
          type: TransactionType.P2P,
          amount: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockTypeOrmRepository.find.mockResolvedValue(entities);

      const result = await repository.findByStatus(TransactionStatus.PENDING);

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { status: TransactionStatus.PENDING },
        take: 100,
        order: { createdAt: 'ASC' },
      });
      expect(result).toHaveLength(1);
    });

    it('should respect custom limit', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      await repository.findByStatus(TransactionStatus.COMPLETED, 50);

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 })
      );
    });
  });

  describe('findFailedTransactionsForRetry', () => {
    it('should find failed transactions eligible for retry', async () => {
      const entities = [
        createMockEntity({
          id: 'txn-1',
          status: TransactionStatus.FAILED,
          retryCount: 1,
          antifraudStatus: 'APPROVED',
          externalId: 'ext-1',
          type: TransactionType.P2P,
          amount: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockQueryBuilder.getMany.mockResolvedValue(entities);

      const result = await repository.findFailedTransactionsForRetry(10);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'transaction.status = :status',
        { status: TransactionStatus.FAILED }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.retryCount < :maxRetries',
        { maxRetries: 3 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "transaction.antifraudStatus != 'REJECTED'"
      );
      expect(result).toHaveLength(1);
    });

    it('should order by updated date ascending', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await repository.findFailedTransactionsForRetry(5);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('transaction.updatedAt', 'ASC');
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('update', () => {
    it('should update existing transaction', async () => {
      const transaction = new Transaction({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.COMPLETED,
        metadata: {},
        retryCount: 0,
      });

      const updatedEntity = createMockEntity({
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.update(transaction);

      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('countByStatus', () => {
    it('should count transactions by status', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(42);

      const result = await repository.countByStatus(TransactionStatus.PENDING);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'transaction.status = :status',
        { status: TransactionStatus.PENDING }
      );
      expect(result).toBe(42);
    });

    it('should filter by date range when provided', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      mockQueryBuilder.getCount.mockResolvedValue(10);

      await repository.countByStatus(TransactionStatus.COMPLETED, startDate, endDate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
    });

    it('should not filter by date when not provided', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(5);

      await repository.countByStatus(TransactionStatus.FAILED);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('getTotalAmountByStatus', () => {
    it('should sum transaction amounts by status', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: 1500.50 });

      const result = await repository.getTotalAmountByStatus(TransactionStatus.COMPLETED);

      expect(mockQueryBuilder.select).toHaveBeenCalledWith('SUM(transaction.amount)', 'total');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'transaction.status = :status',
        { status: TransactionStatus.COMPLETED }
      );
      expect(result).toBe(1500.50);
    });

    it('should return 0 when no transactions found', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue(null);

      const result = await repository.getTotalAmountByStatus(TransactionStatus.PENDING);

      expect(result).toBe(0);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      mockQueryBuilder.getRawOne.mockResolvedValue({ total: 500 });

      await repository.getTotalAmountByStatus(TransactionStatus.COMPLETED, startDate, endDate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
    });
  });

  describe('Transaction Management', () => {
    it('should begin transaction', async () => {
      await repository.beginTransaction();

      expect(mockTypeOrmRepository.manager.query).toHaveBeenCalledWith('BEGIN');
    });

    it('should commit transaction', async () => {
      await repository.beginTransaction();
      await repository.commitTransaction();

      expect(mockTypeOrmRepository.manager.query).toHaveBeenCalledWith('COMMIT');
    });

    it('should rollback transaction', async () => {
      await repository.beginTransaction();
      await repository.rollbackTransaction();

      expect(mockTypeOrmRepository.manager.query).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should not commit if transaction not started', async () => {
      await repository.commitTransaction();

      expect(mockTypeOrmRepository.manager.query).not.toHaveBeenCalled();
    });

    it('should not rollback if transaction not started', async () => {
      await repository.rollbackTransaction();

      expect(mockTypeOrmRepository.manager.query).not.toHaveBeenCalled();
    });
  });

  describe('Domain/Entity Conversion', () => {
    it('should handle null antifraud fields in entity to domain conversion', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        antifraudScore: null,
        antifraudStatus: null,
        antifraudCheckedAt: null,
        retryCount: 0,
        idempotencyKey: null,
        completedAt: null,
        failureReason: null,
        reversedAt: null,
        reversalTransactionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('txn-123');

      expect(result?.antifraudScore).toBeUndefined();
      expect(result?.antifraudStatus).toBeUndefined();
      expect(result?.completedAt).toBeUndefined();
    });

    it('should convert amount to number', async () => {
      const mockEntity = createMockEntity({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: '150.75' as unknown as number,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity);

      const result = await repository.findById('txn-123');

      expect(typeof result?.amount).toBe('number');
      expect(result?.amount).toBe(150.75);
    });
  });
});
