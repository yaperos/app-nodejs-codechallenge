import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEventService } from './transaction-event.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockTransactionQueue: jest.Mocked<{ add: jest.Mock }>;
  let mockAntifraudQueue: jest.Mocked<{ add: jest.Mock }>;
  let mockEventService: jest.Mocked<TransactionEventService>;

  beforeEach(async () => {
    mockRepository = {
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
    } as unknown as jest.Mocked<ITransactionRepository>;

    mockTransactionQueue = {
      add: jest.fn().mockResolvedValue({}),
    };

    mockAntifraudQueue = {
      add: jest.fn().mockResolvedValue({}),
    };

    mockEventService = {
      publishTransactionCreated: jest.fn().mockResolvedValue(undefined),
      publishTransactionProcessing: jest.fn().mockResolvedValue(undefined),
      publishTransactionCompleted: jest.fn().mockResolvedValue(undefined),
      publishTransactionFailed: jest.fn().mockResolvedValue(undefined),
      publishTransactionReversed: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<TransactionEventService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
        {
          provide: getQueueToken('transactions'),
          useValue: mockTransactionQueue,
        },
        {
          provide: getQueueToken('antifraud'),
          useValue: mockAntifraudQueue,
        },
        {
          provide: TransactionEventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    let dto: CreateTransactionDto;

    beforeEach(() => {
      dto = {
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: '+51999888777',
        targetAccountId: '+51999888666',
        metadata: { description: 'Test payment' },
      };
    });

    it('should create a new transaction successfully', async () => {
      const savedTransaction = new Transaction({
        id: 'txn-123',
        externalId: 'ext-123',
        ...dto,
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.save.mockResolvedValue(savedTransaction);

      const result = await service.createTransaction(dto);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockEventService.publishTransactionCreated).toHaveBeenCalled();
      expect(mockAntifraudQueue.add).toHaveBeenCalledWith(
        'check-transaction',
        expect.objectContaining({
          transactionId: 'txn-123',
        }),
        expect.any(Object)
      );
      expect(result).toEqual(savedTransaction);
    });

    it('should return existing transaction when idempotency key exists', async () => {
      dto.idempotencyKey = 'idem-key-123';
      const existingTransaction = new Transaction({
        id: 'existing-123',
        ...dto,
        status: TransactionStatus.COMPLETED,
        retryCount: 0,
      });

      mockRepository.findByIdempotencyKey.mockResolvedValue(existingTransaction);

      const result = await service.createTransaction(dto);

      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(existingTransaction);
    });

    it('should create transaction when idempotency key does not exist', async () => {
      dto.idempotencyKey = 'new-key-456';
      mockRepository.findByIdempotencyKey.mockResolvedValue(null);

      const savedTransaction = new Transaction({
        id: 'txn-456',
        ...dto,
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });
      mockRepository.save.mockResolvedValue(savedTransaction);

      const result = await service.createTransaction(dto);

      expect(mockRepository.findByIdempotencyKey).toHaveBeenCalledWith('new-key-456');
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.id).toBe('txn-456');
    });

    it('should use default values for optional fields', async () => {
      const minimalDto = {
        amount: 50,
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
      } as CreateTransactionDto;

      const savedTransaction = new Transaction({
        id: 'txn-789',
        type: TransactionType.P2P,
        amount: 50,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
      });
      mockRepository.save.mockResolvedValue(savedTransaction);

      const result = await service.createTransaction(minimalDto);

      expect(result.type).toBe(TransactionType.P2P);
      expect(result.currency).toBe('PEN');
      expect(result.metadata).toEqual({});
    });

    it('should emit transaction created event with correct parameters', async () => {
      const savedTransaction = new Transaction({
        id: 'txn-event',
        externalId: 'ext-event',
        ...dto,
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });
      mockRepository.save.mockResolvedValue(savedTransaction);

      await service.createTransaction(dto);

      expect(mockEventService.publishTransactionCreated).toHaveBeenCalledWith(
        'txn-event',
        'ext-event',
        dto.type,
        dto.amount,
        dto.currency,
        dto.sourceAccountId,
        dto.targetAccountId,
        dto.metadata
      );
    });
  });

  describe('processApprovedTransaction', () => {
    it('should process approved transaction successfully', async () => {
      const transaction = new Transaction({
        id: 'txn-approved',
        antifraudStatus: 'APPROVED',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      const result = await service.processApprovedTransaction('txn-approved');

      expect(mockTransactionQueue.add).toHaveBeenCalledWith(
        'process-transaction',
        expect.objectContaining({
          transactionId: 'txn-approved',
          antifraudApproved: true,
        }),
        expect.any(Object)
      );
      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.processApprovedTransaction('non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when transaction not approved by antifraud', async () => {
      const transaction = new Transaction({
        id: 'txn-rejected',
        antifraudStatus: 'REJECTED',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      await expect(
        service.processApprovedTransaction('txn-rejected')
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('processTransaction', () => {
    it('should process transaction successfully', async () => {
      const transaction = new Transaction({
        id: 'txn-process',
        antifraudStatus: 'APPROVED',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);
      mockRepository.update.mockResolvedValue(transaction);

      jest.spyOn(service as any, 'simulatePaymentProcessing').mockResolvedValue(undefined);

      const result = await service.processTransaction('txn-process');

      expect(mockRepository.update).toHaveBeenCalledTimes(2); 
      expect(mockEventService.publishTransactionProcessing).toHaveBeenCalled();
      expect(mockEventService.publishTransactionCompleted).toHaveBeenCalled();
      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.processTransaction('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ConflictException when not approved by antifraud', async () => {
      const transaction = new Transaction({
        id: 'txn-not-approved',
        antifraudStatus: 'PENDING',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      await expect(service.processTransaction('txn-not-approved')).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw ConflictException when transaction cannot be processed', async () => {
      const transaction = new Transaction({
        id: 'txn-completed',
        antifraudStatus: 'APPROVED',
        status: TransactionStatus.COMPLETED,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      await expect(service.processTransaction('txn-completed')).rejects.toThrow(
        ConflictException
      );
    });

    it('should handle processing failure and mark as failed', async () => {

      mockRepository.findById.mockImplementation(() => {
        return Promise.resolve(new Transaction({
          id: 'txn-fail',
          antifraudStatus: 'APPROVED',
          status: TransactionStatus.PENDING,
          retryCount: 0,
        }));
      });

      const updatedTransaction = new Transaction({
        id: 'txn-fail',
        antifraudStatus: 'APPROVED',
        status: TransactionStatus.FAILED,
        retryCount: 0,
      });
      mockRepository.update.mockResolvedValue(updatedTransaction);

      const error = new Error('Payment processing failed');
      jest.spyOn(service as any, 'simulatePaymentProcessing').mockRejectedValue(error);

      await expect(service.processTransaction('txn-fail')).rejects.toThrow(error);

      expect(mockEventService.publishTransactionFailed).toHaveBeenCalledWith(
        'txn-fail',
        'Payment processing failed'
      );
    });
  });

  describe('getTransaction', () => {
    it('should return transaction when found', async () => {
      const transaction = new Transaction({
        id: 'txn-123',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      const result = await service.getTransaction('txn-123');

      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getTransaction('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getTransactionByExternalId', () => {
    it('should return transaction when found', async () => {
      const transaction = new Transaction({
        id: 'txn-123',
        externalId: 'ext-456',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findByExternalId.mockResolvedValue(transaction);

      const result = await service.getTransactionByExternalId('ext-456');

      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockRepository.findByExternalId.mockResolvedValue(null);

      await expect(
        service.getTransactionByExternalId('non-existent')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTransactionsByAccountId', () => {
    it('should return transactions for account', async () => {
      const transactions = [
        new Transaction({ id: 'txn-1', retryCount: 0 }),
        new Transaction({ id: 'txn-2', retryCount: 0 }),
      ];

      mockRepository.findByAccountId.mockResolvedValue(transactions);

      const result = await service.getTransactionsByAccountId('+51999888777');

      expect(mockRepository.findByAccountId).toHaveBeenCalledWith(
        '+51999888777',
        100,
        0
      );
      expect(result).toEqual(transactions);
    });

    it('should use custom limit and offset', async () => {
      mockRepository.findByAccountId.mockResolvedValue([]);

      await service.getTransactionsByAccountId('+51999888777', 50, 25);

      expect(mockRepository.findByAccountId).toHaveBeenCalledWith(
        '+51999888777',
        50,
        25
      );
    });

    it('should return empty array when no transactions found', async () => {
      mockRepository.findByAccountId.mockResolvedValue([]);

      const result = await service.getTransactionsByAccountId('+51999888777');

      expect(result).toEqual([]);
    });
  });

  describe('getTransactionsByStatus', () => {
    it('should return transactions by status', async () => {
      const transactions = [
        new Transaction({ id: 'txn-1', status: TransactionStatus.COMPLETED, retryCount: 0 }),
      ];

      mockRepository.findByStatus.mockResolvedValue(transactions);

      const result = await service.getTransactionsByStatus(TransactionStatus.COMPLETED);

      expect(mockRepository.findByStatus).toHaveBeenCalledWith(
        TransactionStatus.COMPLETED,
        100
      );
      expect(result).toEqual(transactions);
    });

    it('should use custom limit', async () => {
      mockRepository.findByStatus.mockResolvedValue([]);

      await service.getTransactionsByStatus(TransactionStatus.PENDING, 25);

      expect(mockRepository.findByStatus).toHaveBeenCalledWith(
        TransactionStatus.PENDING,
        25
      );
    });
  });

  describe('reverseTransaction', () => {
    it('should reverse transaction successfully', async () => {
      const originalTransaction = new Transaction({
        id: 'original-123',
        type: TransactionType.P2P,
        amount: 500,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.COMPLETED,
        metadata: { test: 'data' },
        retryCount: 0,
      });

      const reversalTransaction = new Transaction({
        id: 'reversal-456',
        type: TransactionType.P2P,
        amount: 500,
        currency: 'PEN',
        sourceAccountId: 'tgt', 
        targetAccountId: 'src', 
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(originalTransaction);
      mockRepository.save.mockResolvedValue(reversalTransaction);
      mockRepository.update.mockResolvedValue(originalTransaction);

      const result = await service.reverseTransaction('original-123', 'Customer request');

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockTransactionQueue.add).toHaveBeenCalledWith(
        'process-transaction',
        expect.objectContaining({
          transactionId: 'reversal-456',
        })
      );
      expect(result).toEqual(reversalTransaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.reverseTransaction('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ConflictException when transaction cannot be reversed', async () => {
      const transaction = new Transaction({
        id: 'txn-pending',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(transaction);

      await expect(service.reverseTransaction('txn-pending')).rejects.toThrow(
        ConflictException
      );
    });

    it('should include reversal reason in metadata', async () => {
      const originalTransaction = new Transaction({
        id: 'original-123',
        type: TransactionType.P2P,
        amount: 500,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.COMPLETED,
        metadata: {},
        retryCount: 0,
      });

      const reversalTransaction = new Transaction({
        id: 'reversal-456',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(originalTransaction);
      mockRepository.save.mockResolvedValue(reversalTransaction);
      mockRepository.update.mockResolvedValue(originalTransaction);

      await service.reverseTransaction('original-123', 'Test reason');

      const savedReversalCall = mockRepository.save.mock.calls[0][0];
      expect(savedReversalCall.metadata.reversalReason).toBe('Test reason');
      expect(savedReversalCall.metadata.originalTransactionId).toBe('original-123');
    });

    it('should use default reversal reason when not provided', async () => {
      const originalTransaction = new Transaction({
        id: 'original-789',
        type: TransactionType.P2P,
        amount: 300,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.COMPLETED,
        metadata: {},
        retryCount: 0,
      });

      const reversalTransaction = new Transaction({
        id: 'reversal-999',
        status: TransactionStatus.PENDING,
        retryCount: 0,
      });

      mockRepository.findById.mockResolvedValue(originalTransaction);
      mockRepository.save.mockResolvedValue(reversalTransaction);
      mockRepository.update.mockResolvedValue(originalTransaction);

      await service.reverseTransaction('original-789');

      const savedReversalCall = mockRepository.save.mock.calls[0][0];
      expect(savedReversalCall.metadata.reversalReason).toBe('Reversal requested');
    });
  });

  describe('retryFailedTransactions', () => {
    it('should retry eligible failed transactions', async () => {
      const failedTransactions = [
        new Transaction({
          id: 'failed-1',
          status: TransactionStatus.FAILED,
          retryCount: 1,
          antifraudStatus: 'APPROVED',
        }),
        new Transaction({
          id: 'failed-2',
          status: TransactionStatus.FAILED,
          retryCount: 0,
          antifraudStatus: 'APPROVED',
        }),
      ];

      mockRepository.findFailedTransactionsForRetry.mockResolvedValue(failedTransactions);
      mockRepository.update.mockResolvedValue(failedTransactions[0]);

      const result = await service.retryFailedTransactions();

      expect(mockRepository.update).toHaveBeenCalledTimes(2);
      expect(mockTransactionQueue.add).toHaveBeenCalledTimes(2);
      expect(result).toBe(2);
    });

    it('should return zero when no failed transactions found', async () => {
      mockRepository.findFailedTransactionsForRetry.mockResolvedValue([]);

      const result = await service.retryFailedTransactions();

      expect(result).toBe(0);
      expect(mockTransactionQueue.add).not.toHaveBeenCalled();
    });

    it('should skip transactions that cannot be retried', async () => {
      const failedTransactions = [
        new Transaction({
          id: 'failed-maxed',
          status: TransactionStatus.FAILED,
          retryCount: 3, 
          antifraudStatus: 'APPROVED',
        }),
      ];

      mockRepository.findFailedTransactionsForRetry.mockResolvedValue(failedTransactions);

      const result = await service.retryFailedTransactions();

      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(mockTransactionQueue.add).not.toHaveBeenCalled();
      expect(result).toBe(1); 
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      mockRepository.countByStatus.mockImplementation((status) => {
        const counts: Record<string, number> = {
          [TransactionStatus.PENDING]: 10,
          [TransactionStatus.PROCESSING]: 5,
          [TransactionStatus.COMPLETED]: 100,
          [TransactionStatus.FAILED]: 3,
        };
        return Promise.resolve(counts[status] || 0);
      });

      mockRepository.getTotalAmountByStatus.mockImplementation((status) => {
        const amounts: Record<string, number> = {
          [TransactionStatus.COMPLETED]: 50000,
          [TransactionStatus.FAILED]: 1500,
        };
        return Promise.resolve(amounts[status] || 0);
      });
    });

    it('should return statistics without date range', async () => {
      const stats = await service.getStatistics();

      expect(stats.counts).toEqual({
        pending: 10,
        processing: 5,
        completed: 100,
        failed: 3,
        total: 118,
      });
      expect(stats.amounts).toEqual({
        completed: 50000,
        failed: 1500,
      });
      expect(stats.period.startDate).toBeUndefined();
      expect(stats.period.endDate).toBeUndefined();
    });

    it('should return statistics with date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const stats = await service.getStatistics(startDate, endDate);

      expect(mockRepository.countByStatus).toHaveBeenCalledWith(
        TransactionStatus.PENDING,
        startDate,
        endDate
      );
      expect(stats.period.startDate).toBe(startDate.toISOString());
      expect(stats.period.endDate).toBe(endDate.toISOString());
    });

    it('should calculate total count correctly', async () => {
      const stats = await service.getStatistics();

      expect(stats.counts.total).toBe(118); 
    });
  });

  describe('simulatePaymentProcessing', () => {
    it('should resolve successfully most of the time', async () => {
      const transaction = new Transaction({
        id: 'txn-test',
        retryCount: 0,
      });

      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      await expect(
        (service as any).simulatePaymentProcessing(transaction)
      ).resolves.not.toThrow();

      jest.spyOn(Math, 'random').mockRestore();
    });

    it('should fail with 10% probability', async () => {
      const transaction = new Transaction({
        id: 'txn-test',
        retryCount: 0,
      });

      jest.spyOn(Math, 'random').mockReturnValue(0.05);

      await expect(
        (service as any).simulatePaymentProcessing(transaction)
      ).rejects.toThrow('Payment processing failed: Insufficient funds');

      jest.spyOn(Math, 'random').mockRestore();
    });
  });
});
