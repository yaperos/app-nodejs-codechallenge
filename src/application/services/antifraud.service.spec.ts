import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { AntifraudService } from './antifraud.service';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';

describe('AntifraudService', () => {
  let service: AntifraudService;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
  let mockKafkaClient: {
    emit: jest.Mock;
    subscribeToResponseOf: jest.Mock;
    connect: jest.Mock;
  };
  let mockAntifraudQueue: {
    add: jest.Mock;
  };

  beforeEach(async () => {
    mockTransactionRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByExternalId: jest.fn(),
      findByIdempotencyKey: jest.fn(),
      findByAccountId: jest.fn(),
      findByStatus: jest.fn(),
      findFailedTransactionsForRetry: jest.fn(),
      update: jest.fn(),
      countByStatus: jest.fn(),
      getTotalAmountByStatus: jest.fn(),
      beginTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    };

    mockKafkaClient = {
      emit: jest.fn(),
      subscribeToResponseOf: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
    };

    mockAntifraudQueue = {
      add: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
        {
          provide: 'KAFKA_SERVICE',
          useValue: mockKafkaClient,
        },
        {
          provide: getQueueToken('antifraud'),
          useValue: mockAntifraudQueue,
        },
      ],
    }).compile();

    service = module.get<AntifraudService>(AntifraudService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should subscribe to Kafka topics and connect', async () => {
      await service.onModuleInit();

      expect(mockKafkaClient.subscribeToResponseOf).toHaveBeenCalledWith('transaction.created');
      expect(mockKafkaClient.subscribeToResponseOf).toHaveBeenCalledWith('antifraud.result');
      expect(mockKafkaClient.connect).toHaveBeenCalled();
    });
  });

  describe('checkTransaction', () => {
    let mockTransaction: Transaction;

    beforeEach(() => {
      mockTransaction = new Transaction({
        id: 'txn-123',
        externalId: 'ext-123',
        type: TransactionType.P2P,
        amount: 500,
        currency: 'PEN',
        sourceAccountId: 'source-acc',
        targetAccountId: 'target-acc',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
      });

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.findByAccountId.mockResolvedValue([]);
      mockTransactionRepository.update.mockResolvedValue(mockTransaction);
    });

    it('should approve transaction with amount below threshold', async () => {
      mockTransaction.amount = 500;

      const result = await service.checkTransaction('txn-123');

      expect(result.approved).toBe(true);
      expect(result.score).toBeLessThan(50);
      expect(result.transactionId).toBe('txn-123');
      expect(result.checkedAt).toBeInstanceOf(Date);
    });

    it('should reject transaction with amount above 1000', async () => {
      mockTransaction.amount = 1500;

      const result = await service.checkTransaction('txn-123');

      expect(result.approved).toBe(false);
      expect(result.score).toBeGreaterThanOrEqual(100);
      expect(result.reason).toContain('Amount 1500 exceeds maximum allowed 1000');
    });

    it('should reject transaction with amount exactly 1001', async () => {
      mockTransaction.amount = 1001;

      const result = await service.checkTransaction('txn-123');

      expect(result.approved).toBe(false);
      expect(result.score).toBeGreaterThanOrEqual(50);
    });

    it('should approve transaction with amount exactly 1000', async () => {
      mockTransaction.amount = 1000;

      const result = await service.checkTransaction('txn-123');

      expect(result.transactionId).toBe('txn-123');
    });

    it('should add velocity risk for high transaction frequency', async () => {

      const recentTransactions = Array(6).fill(null).map((_, i) => new Transaction({
        id: `txn-${i}`,
        sourceAccountId: 'source-acc',
        createdAt: new Date(Date.now() - 60000), 
      }));

      mockTransactionRepository.findByAccountId.mockResolvedValue(recentTransactions);

      const result = await service.checkTransaction('txn-123');

      expect(result.score).toBeGreaterThan(0);
      expect(result.reason).toContain('transaction velocity');
    });

    it('should detect suspicious pattern for round numbers near limit', async () => {
      mockTransaction.amount = 999;

      const result = await service.checkTransaction('txn-123');

      expect(result.reason).toContain('Suspicious transaction pattern');
    });

    it('should detect self-transfer as suspicious', async () => {
      mockTransaction.sourceAccountId = 'same-acc';
      mockTransaction.targetAccountId = 'same-acc';

      const result = await service.checkTransaction('txn-123');

      expect(result.reason).toContain('Suspicious transaction pattern');
    });

    it('should flag unusual time transactions (2AM-5AM)', async () => {
      const unusualTime = new Date();
      unusualTime.setHours(3, 0, 0, 0);
      mockTransaction.createdAt = unusualTime;

      const result = await service.checkTransaction('txn-123');

      expect(result.reason).toContain('unusual hour');
    });

    it('should update transaction with antifraud results', async () => {
      const result = await service.checkTransaction('txn-123');

      expect(mockTransactionRepository.update).toHaveBeenCalled();
      const updatedTransaction = mockTransactionRepository.update.mock.calls[0][0];

      expect(updatedTransaction.antifraudScore).toBe(result.score);
      expect(updatedTransaction.antifraudStatus).toBe(result.approved ? 'APPROVED' : 'REJECTED');
      expect(updatedTransaction.antifraudCheckedAt).toBeInstanceOf(Date);
    });

    it('should add approved transaction to processing queue', async () => {
      mockTransaction.amount = 100; 

      await service.checkTransaction('txn-123');

      expect(mockAntifraudQueue.add).toHaveBeenCalledWith(
        'process-approved-transaction',
        expect.objectContaining({
          transactionId: 'txn-123',
          antifraudScore: expect.any(Number),
        }),
        expect.objectContaining({
          delay: 100,
        })
      );
    });

    it('should mark rejected transaction as FAILED', async () => {
      mockTransaction.amount = 2000; 

      await service.checkTransaction('txn-123');

      expect(mockTransactionRepository.update).toHaveBeenCalled();
      const updatedTransaction = mockTransactionRepository.update.mock.calls[0][0];

      expect(updatedTransaction.status).toBe(TransactionStatus.FAILED);
      expect(updatedTransaction.failureReason).toBeDefined();
    });

    it('should emit antifraud result to Kafka', async () => {
      await service.checkTransaction('txn-123');

      expect(mockKafkaClient.emit).toHaveBeenCalledWith(
        'antifraud.result',
        expect.objectContaining({
          eventType: 'antifraud.checked',
          transactionId: 'txn-123',
          approved: expect.any(Boolean),
          score: expect.any(Number),
          timestamp: expect.any(String),
        })
      );
    });

    it('should throw error when transaction not found', async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(service.checkTransaction('non-existent')).rejects.toThrow(
        'Transaction non-existent not found'
      );
    });

    it('should handle repository errors', async () => {
      mockTransactionRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(service.checkTransaction('txn-123')).rejects.toThrow('Database error');
    });
  });

  describe('handleTransactionCreated', () => {
    it('should add transaction to antifraud queue', async () => {
      const eventData = {
        transactionId: 'txn-456',
        amount: 500,
      };

      await service.handleTransactionCreated(eventData);

      expect(mockAntifraudQueue.add).toHaveBeenCalledWith(
        'check-transaction',
        expect.objectContaining({
          transactionId: 'txn-456',
          timestamp: expect.any(String),
        }),
        expect.objectContaining({
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        })
      );
    });

    it('should handle errors gracefully', async () => {
      mockAntifraudQueue.add.mockRejectedValue(new Error('Queue error'));

      await expect(
        service.handleTransactionCreated({ transactionId: 'txn-123' })
      ).resolves.not.toThrow();
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      const createMockTransaction = (overrides = {}) => new Transaction({
        id: 'txn-1',
        status: TransactionStatus.COMPLETED,
        antifraudCheckedAt: new Date(),
        antifraudStatus: 'APPROVED',
        antifraudScore: 20,
        ...overrides,
      });

      mockTransactionRepository.findByStatus.mockImplementation((status) => {
        if (status === TransactionStatus.COMPLETED) {
          return Promise.resolve([
            createMockTransaction({ antifraudScore: 30, antifraudStatus: 'APPROVED' }),
            createMockTransaction({ antifraudScore: 80, antifraudStatus: 'REJECTED', failureReason: 'High risk' }),
          ]);
        }
        return Promise.resolve([]);
      });
    });

    it('should calculate statistics correctly', async () => {
      const stats = await service.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.checked).toBe(2);
      expect(stats.approved).toBe(1);
      expect(stats.rejected).toBe(1);
      expect(stats.averageScore).toBe(55); 
      expect(stats.highRiskCount).toBe(1); 
    });

    it('should count by failure reason', async () => {
      const stats = await service.getStatistics();

      expect(stats.byReason['High risk']).toBe(1);
    });

    it('should handle empty results', async () => {
      mockTransactionRepository.findByStatus.mockResolvedValue([]);

      const stats = await service.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.checked).toBe(0);
      expect(stats.averageScore).toBe(0);
    });

    it('should handle transactions without antifraud check', async () => {
      mockTransactionRepository.findByStatus.mockImplementation((status) => {
        if (status === TransactionStatus.PENDING) {
          return Promise.resolve([
            new Transaction({
              id: 'txn-1',
              status: TransactionStatus.PENDING,

            }),
          ]);
        }
        return Promise.resolve([]);
      });

      const stats = await service.getStatistics();

      expect(stats.total).toBe(1);
      expect(stats.checked).toBe(0);
    });
  });

  describe('Antifraud Rules', () => {
    let mockTransaction: Transaction;

    beforeEach(() => {
      mockTransaction = new Transaction({
        id: 'txn-test',
        amount: 500,
        sourceAccountId: 'source',
        targetAccountId: 'target',
        createdAt: new Date(),
      });

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.findByAccountId.mockResolvedValue([]);
      mockTransactionRepository.update.mockResolvedValue(mockTransaction);
    });

    it('should calculate cumulative risk score', async () => {

      mockTransaction.amount = 1500; 
      mockTransaction.sourceAccountId = 'same';
      mockTransaction.targetAccountId = 'same'; 
      const unusualTime = new Date();
      unusualTime.setHours(3);
      mockTransaction.createdAt = unusualTime;

      const result = await service.checkTransaction('txn-test');

      expect(result.score).toBeGreaterThanOrEqual(100); 
      expect(result.approved).toBe(false);
    });

    it('should approve low-risk transactions', async () => {
      mockTransaction.amount = 50;
      const normalTime = new Date();
      normalTime.setHours(14); 
      mockTransaction.createdAt = normalTime;
      mockTransaction.sourceAccountId = 'source';
      mockTransaction.targetAccountId = 'target';

      const result = await service.checkTransaction('txn-test');

      expect(result.score).toBeLessThan(50);
      expect(result.approved).toBe(true);
    });
  });
});
