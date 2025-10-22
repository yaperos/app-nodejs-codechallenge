import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../../application/services/transaction.service';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockTransactionService: jest.Mocked<TransactionService>;

  const createMockTransaction = (overrides = {}): Transaction => {
    return new Transaction({
      id: 'txn-123',
      externalId: 'ext-123',
      type: TransactionType.P2P,
      amount: 500,
      currency: 'PEN',
      sourceAccountId: '+51999888777',
      targetAccountId: '+51999888666',
      status: TransactionStatus.PENDING,
      metadata: {},
      retryCount: 0,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      ...overrides,
    });
  };

  beforeEach(async () => {
    mockTransactionService = {
      createTransaction: jest.fn(),
      getTransaction: jest.fn(),
      getTransactionByExternalId: jest.fn(),
      getTransactionsByAccountId: jest.fn(),
      getTransactionsByStatus: jest.fn(),
      reverseTransaction: jest.fn(),
      retryFailedTransactions: jest.fn(),
      getStatistics: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have TransactionService injected', () => {
      expect(controller['transactionService']).toBe(mockTransactionService);
    });
  });

  describe('POST /transactions (create)', () => {
    let createTransactionDto: CreateTransactionDto;
    let mockTransaction: Transaction;

    beforeEach(() => {
      createTransactionDto = {
        type: TransactionType.P2P,
        amount: 250.50,
        currency: 'PEN',
        sourceAccountId: '+51999888777',
        targetAccountId: '+51999888666',
        metadata: { description: 'Test payment' },
        idempotencyKey: 'unique-key-123',
      };

      mockTransaction = createMockTransaction({
        amount: 250.50,
        status: TransactionStatus.PENDING,
      });

      mockTransactionService.createTransaction.mockResolvedValue(mockTransaction);
    });

    it('should create a new transaction successfully', async () => {
      const result = await controller.create(createTransactionDto);

      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual({
        success: true,
        data: {
          id: mockTransaction.id,
          externalId: mockTransaction.externalId,
          status: mockTransaction.status,
          amount: mockTransaction.amount,
          currency: mockTransaction.currency,
          createdAt: mockTransaction.createdAt,
        },
      });
    });

    it('should return success: true in response', async () => {
      const result = await controller.create(createTransactionDto);

      expect(result.success).toBe(true);
    });

    it('should include all required fields in response', async () => {
      const result = await controller.create(createTransactionDto);

      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('externalId');
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('amount');
      expect(result.data).toHaveProperty('currency');
      expect(result.data).toHaveProperty('createdAt');
    });

    it('should handle service errors', async () => {
      const error = new Error('Transaction creation failed');
      mockTransactionService.createTransaction.mockRejectedValue(error);

      await expect(controller.create(createTransactionDto)).rejects.toThrow(
        'Transaction creation failed'
      );
    });

    it('should propagate duplicate idempotency key errors', async () => {
      const error = new Error('Transaction with idempotency key already exists');
      mockTransactionService.createTransaction.mockRejectedValue(error);

      await expect(controller.create(createTransactionDto)).rejects.toThrow(
        'Transaction with idempotency key already exists'
      );
    });
  });

  describe('GET /transactions/:id (findOne)', () => {
    let mockTransaction: Transaction;

    beforeEach(() => {
      mockTransaction = createMockTransaction();
      mockTransactionService.getTransaction.mockResolvedValue(mockTransaction);
    });

    it('should retrieve a transaction by ID', async () => {
      const result = await controller.findOne('txn-123');

      expect(mockTransactionService.getTransaction).toHaveBeenCalledWith('txn-123');
      expect(result).toEqual({
        success: true,
        data: mockTransaction,
      });
    });

    it('should return success: true in response', async () => {
      const result = await controller.findOne('txn-123');

      expect(result.success).toBe(true);
    });

    it('should include full transaction data', async () => {
      const result = await controller.findOne('txn-123');

      expect(result.data).toBe(mockTransaction);
      expect(result.data.id).toBe('txn-123');
    });

    it('should handle transaction not found', async () => {
      mockTransactionService.getTransaction.mockRejectedValue(
        new Error('Transaction not found')
      );

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        'Transaction not found'
      );
    });
  });

  describe('GET /transactions/external/:externalId (findByExternalId)', () => {
    let mockTransaction: Transaction;

    beforeEach(() => {
      mockTransaction = createMockTransaction({
        externalId: 'ext-456',
      });
      mockTransactionService.getTransactionByExternalId.mockResolvedValue(mockTransaction);
    });

    it('should retrieve a transaction by external ID', async () => {
      const result = await controller.findByExternalId('ext-456');

      expect(mockTransactionService.getTransactionByExternalId).toHaveBeenCalledWith('ext-456');
      expect(result).toEqual({
        success: true,
        data: mockTransaction,
      });
    });

    it('should return success: true in response', async () => {
      const result = await controller.findByExternalId('ext-456');

      expect(result.success).toBe(true);
    });

    it('should handle external ID not found', async () => {
      mockTransactionService.getTransactionByExternalId.mockRejectedValue(
        new Error('Transaction with external ID not found')
      );

      await expect(controller.findByExternalId('missing-ext')).rejects.toThrow(
        'Transaction with external ID not found'
      );
    });
  });

  describe('GET /transactions/account/:accountId (findByAccount)', () => {
    let mockTransactions: Transaction[];

    beforeEach(() => {
      mockTransactions = [
        createMockTransaction({ id: 'txn-1' }),
        createMockTransaction({ id: 'txn-2' }),
        createMockTransaction({ id: 'txn-3' }),
      ];
      mockTransactionService.getTransactionsByAccountId.mockResolvedValue(mockTransactions);
    });

    it('should retrieve transactions by account ID with default pagination', async () => {
      const result = await controller.findByAccount('+51999888777', 100, 0);

      expect(mockTransactionService.getTransactionsByAccountId).toHaveBeenCalledWith(
        '+51999888777',
        100,
        0
      );
      expect(result).toEqual({
        success: true,
        data: mockTransactions,
        pagination: {
          limit: 100,
          offset: 0,
          count: 3,
        },
      });
    });

    it('should retrieve transactions with custom limit and offset', async () => {
      const result = await controller.findByAccount('+51999888777', 50, 10);

      expect(mockTransactionService.getTransactionsByAccountId).toHaveBeenCalledWith(
        '+51999888777',
        50,
        10
      );
      expect(result.pagination).toEqual({
        limit: 50,
        offset: 10,
        count: 3,
      });
    });

    it('should include pagination metadata in response', async () => {
      const result = await controller.findByAccount('+51999888777', 100, 0);

      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('limit');
      expect(result.pagination).toHaveProperty('offset');
      expect(result.pagination).toHaveProperty('count');
    });

    it('should handle empty transaction list', async () => {
      mockTransactionService.getTransactionsByAccountId.mockResolvedValue([]);

      const result = await controller.findByAccount('+51999888777', 100, 0);

      expect(result.data).toEqual([]);
      expect(result.pagination.count).toBe(0);
    });

    it('should calculate count correctly', async () => {
      const largeList = Array(250)
        .fill(null)
        .map((_, i) => createMockTransaction({ id: `txn-${i}` }));
      mockTransactionService.getTransactionsByAccountId.mockResolvedValue(largeList);

      const result = await controller.findByAccount('+51999888777', 100, 0);

      expect(result.pagination.count).toBe(250);
    });
  });

  describe('GET /transactions/status/:status (findByStatus)', () => {
    let mockTransactions: Transaction[];

    beforeEach(() => {
      mockTransactions = [
        createMockTransaction({ id: 'txn-1', status: TransactionStatus.COMPLETED }),
        createMockTransaction({ id: 'txn-2', status: TransactionStatus.COMPLETED }),
      ];
      mockTransactionService.getTransactionsByStatus.mockResolvedValue(mockTransactions);
    });

    it('should retrieve transactions by status with default limit', async () => {
      const result = await controller.findByStatus(TransactionStatus.COMPLETED, 100);

      expect(mockTransactionService.getTransactionsByStatus).toHaveBeenCalledWith(
        TransactionStatus.COMPLETED,
        100
      );
      expect(result).toEqual({
        success: true,
        data: mockTransactions,
        count: 2,
      });
    });

    it('should retrieve transactions with custom limit', async () => {
      const result = await controller.findByStatus(TransactionStatus.PENDING, 50);

      expect(mockTransactionService.getTransactionsByStatus).toHaveBeenCalledWith(
        TransactionStatus.PENDING,
        50
      );
      expect(result.count).toBe(2);
    });

    it('should include count in response', async () => {
      const result = await controller.findByStatus(TransactionStatus.FAILED, 100);

      expect(result).toHaveProperty('count');
      expect(result.count).toBe(mockTransactions.length);
    });

    it('should handle PROCESSING status', async () => {
      const processingTransactions = [
        createMockTransaction({ status: TransactionStatus.PROCESSING }),
      ];
      mockTransactionService.getTransactionsByStatus.mockResolvedValue(processingTransactions);

      const result = await controller.findByStatus(TransactionStatus.PROCESSING, 100);

      expect(result.data).toEqual(processingTransactions);
      expect(result.count).toBe(1);
    });

    it('should handle REVERSED status', async () => {
      const reversedTransactions = [
        createMockTransaction({ status: TransactionStatus.REVERSED }),
      ];
      mockTransactionService.getTransactionsByStatus.mockResolvedValue(reversedTransactions);

      const result = await controller.findByStatus(TransactionStatus.REVERSED, 100);

      expect(result.data).toEqual(reversedTransactions);
    });

    it('should handle empty results', async () => {
      mockTransactionService.getTransactionsByStatus.mockResolvedValue([]);

      const result = await controller.findByStatus(TransactionStatus.REJECTED, 100);

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('POST /transactions/:id/reverse (reverse)', () => {
    let mockReversalTransaction: Transaction;

    beforeEach(() => {
      mockReversalTransaction = createMockTransaction({
        id: 'reversal-123',
        amount: -500,
        status: TransactionStatus.PENDING,
      });
      mockTransactionService.reverseTransaction.mockResolvedValue(mockReversalTransaction);
    });

    it('should reverse a transaction with reason', async () => {
      const result = await controller.reverse('txn-123', 'Customer request');

      expect(mockTransactionService.reverseTransaction).toHaveBeenCalledWith(
        'txn-123',
        'Customer request'
      );
      expect(result).toEqual({
        success: true,
        data: {
          reversalTransactionId: mockReversalTransaction.id,
          originalTransactionId: 'txn-123',
          status: mockReversalTransaction.status,
          amount: mockReversalTransaction.amount,
        },
      });
    });

    it('should reverse a transaction without reason', async () => {
      const result = await controller.reverse('txn-123', undefined);

      expect(mockTransactionService.reverseTransaction).toHaveBeenCalledWith(
        'txn-123',
        undefined
      );
      expect(result.success).toBe(true);
    });

    it('should include all required fields in response', async () => {
      const result = await controller.reverse('txn-123', 'Test reason');

      expect(result.data).toHaveProperty('reversalTransactionId');
      expect(result.data).toHaveProperty('originalTransactionId');
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('amount');
    });

    it('should handle transaction not found error', async () => {
      mockTransactionService.reverseTransaction.mockRejectedValue(
        new Error('Transaction not found')
      );

      await expect(controller.reverse('non-existent', 'reason')).rejects.toThrow(
        'Transaction not found'
      );
    });

    it('should handle cannot reverse error', async () => {
      mockTransactionService.reverseTransaction.mockRejectedValue(
        new Error('Transaction cannot be reversed')
      );

      await expect(controller.reverse('txn-123', 'reason')).rejects.toThrow(
        'Transaction cannot be reversed'
      );
    });

    it('should pass original transaction ID correctly', async () => {
      const result = await controller.reverse('original-txn-789', undefined);

      expect(result.data.originalTransactionId).toBe('original-txn-789');
    });
  });

  describe('POST /transactions/retry-failed (retryFailed)', () => {
    it('should retry failed transactions successfully', async () => {
      mockTransactionService.retryFailedTransactions.mockResolvedValue(5);

      const result = await controller.retryFailed();

      expect(mockTransactionService.retryFailedTransactions).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: {
          retriedCount: 5,
        },
      });
    });

    it('should return zero when no failed transactions', async () => {
      mockTransactionService.retryFailedTransactions.mockResolvedValue(0);

      const result = await controller.retryFailed();

      expect(result.data.retriedCount).toBe(0);
    });

    it('should return success: true in response', async () => {
      mockTransactionService.retryFailedTransactions.mockResolvedValue(10);

      const result = await controller.retryFailed();

      expect(result.success).toBe(true);
    });

    it('should handle large retry counts', async () => {
      mockTransactionService.retryFailedTransactions.mockResolvedValue(1000);

      const result = await controller.retryFailed();

      expect(result.data.retriedCount).toBe(1000);
    });

    it('should handle service errors', async () => {
      mockTransactionService.retryFailedTransactions.mockRejectedValue(
        new Error('Retry failed')
      );

      await expect(controller.retryFailed()).rejects.toThrow('Retry failed');
    });
  });

  describe('GET /transactions/statistics/summary (getStatistics)', () => {
    const mockStats = {
      counts: {
        pending: 50,
        processing: 20,
        completed: 900,
        failed: 20,
        total: 990,
      },
      amounts: {
        completed: 500000,
        failed: 10000,
      },
      period: {
        startDate: undefined,
        endDate: undefined,
      },
    };

    beforeEach(() => {
      mockTransactionService.getStatistics.mockResolvedValue(mockStats);
    });

    it('should get statistics without date range', async () => {
      const result = await controller.getStatistics(undefined, undefined);

      expect(mockTransactionService.getStatistics).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual({
        success: true,
        data: mockStats,
      });
    });

    it('should get statistics with start date only', async () => {
      const result = await controller.getStatistics('2024-01-01T00:00:00Z', undefined);

      expect(mockTransactionService.getStatistics).toHaveBeenCalledWith(
        new Date('2024-01-01T00:00:00Z'),
        undefined
      );
      expect(result.success).toBe(true);
    });

    it('should get statistics with end date only', async () => {
      const result = await controller.getStatistics(undefined, '2024-12-31T23:59:59Z');

      expect(mockTransactionService.getStatistics).toHaveBeenCalledWith(
        undefined,
        new Date('2024-12-31T23:59:59Z')
      );
      expect(result.success).toBe(true);
    });

    it('should get statistics with full date range', async () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-12-31T23:59:59Z';

      const result = await controller.getStatistics(startDate, endDate);

      expect(mockTransactionService.getStatistics).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate)
      );
      expect(result.data).toEqual(mockStats);
    });

    it('should parse ISO 8601 date strings correctly', async () => {
      await controller.getStatistics('2024-06-15T10:30:00Z', '2024-06-20T15:45:00Z');

      expect(mockTransactionService.getStatistics).toHaveBeenCalledWith(
        new Date('2024-06-15T10:30:00Z'),
        new Date('2024-06-20T15:45:00Z')
      );
    });

    it('should return all statistics fields', async () => {
      const result = await controller.getStatistics();

      expect(result.data).toHaveProperty('counts');
      expect(result.data).toHaveProperty('amounts');
      expect(result.data).toHaveProperty('period');
      expect(result.data.counts).toHaveProperty('pending');
      expect(result.data.counts).toHaveProperty('processing');
      expect(result.data.counts).toHaveProperty('completed');
      expect(result.data.counts).toHaveProperty('failed');
      expect(result.data.counts).toHaveProperty('total');
    });

    it('should handle service errors', async () => {
      mockTransactionService.getStatistics.mockRejectedValue(
        new Error('Statistics calculation failed')
      );

      await expect(controller.getStatistics()).rejects.toThrow(
        'Statistics calculation failed'
      );
    });
  });

  describe('Response Structure Validation', () => {
    it('should always return success field in responses', async () => {
      mockTransactionService.getTransaction.mockResolvedValue(createMockTransaction());

      const result = await controller.findOne('txn-123');

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should always return data field in responses', async () => {
      mockTransactionService.getTransaction.mockResolvedValue(createMockTransaction());

      const result = await controller.findOne('txn-123');

      expect(result).toHaveProperty('data');
    });

    it('should maintain consistent response structure across all endpoints', async () => {
      mockTransactionService.retryFailedTransactions.mockResolvedValue(5);

      const result = await controller.retryFailed();

      expect(result).toMatchObject({
        success: expect.any(Boolean),
        data: expect.any(Object),
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate service layer errors', async () => {
      const serviceError = new Error('Service layer error');
      mockTransactionService.createTransaction.mockRejectedValue(serviceError);

      await expect(
        controller.create({
          type: TransactionType.P2P,
          amount: 100,
          sourceAccountId: '+51999888777',
          targetAccountId: '+51999888666',
        })
      ).rejects.toThrow('Service layer error');
    });

    it('should handle database connection errors', async () => {
      mockTransactionService.getTransaction.mockRejectedValue(
        new Error('Database connection lost')
      );

      await expect(controller.findOne('txn-123')).rejects.toThrow(
        'Database connection lost'
      );
    });

    it('should handle validation errors from service', async () => {
      mockTransactionService.reverseTransaction.mockRejectedValue(
        new Error('Invalid transaction state for reversal')
      );

      await expect(controller.reverse('txn-123', 'reason')).rejects.toThrow(
        'Invalid transaction state for reversal'
      );
    });
  });
});
