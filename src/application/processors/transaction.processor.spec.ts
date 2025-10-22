import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { TransactionProcessor } from './transaction.processor';
import { TransactionService } from '../services/transaction.service';
import { Queue, Job } from 'bull';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

describe('TransactionProcessor', () => {
  let processor: TransactionProcessor;
  let transactionService: jest.Mocked<TransactionService>;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      on: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
      isPaused: jest.fn().mockResolvedValue(false),
      close: jest.fn(),
    } as unknown as jest.Mocked<Queue>;

    transactionService = {
      processTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionProcessor,
        {
          provide: getQueueToken('transactions'),
          useValue: mockQueue,
        },
        {
          provide: TransactionService,
          useValue: transactionService,
        },
      ],
    }).compile();

    processor = module.get<TransactionProcessor>(TransactionProcessor);
  });

  describe('processJob', () => {
    it('should process a transaction successfully', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-1',
        data: {
          transactionId: 'txn-123',
          retry: false,
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      transactionService.processTransaction.mockResolvedValue({
        id: 'txn-123',
        status: TransactionStatus.COMPLETED,
      } as any);

      const result = await processor['processJob'](mockJob as Job);

      expect(transactionService.processTransaction).toHaveBeenCalledWith('txn-123');
      expect(result).toEqual({
        success: true,
        transactionId: 'txn-123',
        status: TransactionStatus.COMPLETED,
        processedAt: expect.any(String),
      });
    });

    it('should process a retry transaction', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-2',
        data: {
          transactionId: 'txn-456',
          retry: true,
        },
        attemptsMade: 1,
        opts: { attempts: 3 },
      };

      transactionService.processTransaction.mockResolvedValue({
        id: 'txn-456',
        status: TransactionStatus.COMPLETED,
      } as any);

      const result = await processor['processJob'](mockJob as Job);

      expect(transactionService.processTransaction).toHaveBeenCalledWith('txn-456');
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('transactionId', 'txn-456');
    });

    it('should handle transaction processing failure', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-3',
        data: {
          transactionId: 'txn-789',
          retry: false,
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      transactionService.processTransaction.mockRejectedValue(
        new Error('Transaction processing failed')
      );

      await expect(processor['processJob'](mockJob as Job)).rejects.toThrow(
        'Transaction processing failed'
      );

      expect(transactionService.processTransaction).toHaveBeenCalledWith('txn-789');
    });
  });

  describe('handleProcessTransaction', () => {
    it('should delegate to base class process method', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-4',
        data: {
          transactionId: 'txn-111',
          retry: false,
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      transactionService.processTransaction.mockResolvedValue({
        id: 'txn-111',
        status: TransactionStatus.PENDING,
      } as any);

      const result = await processor.handleProcessTransaction(mockJob as Job);

      expect(result).toBeDefined();
    });
  });

  describe('constructor', () => {
    it('should initialize with correct queue options', () => {
      expect(processor).toBeDefined();
      expect(processor['options'].queueName).toBe('transactions');
      expect(processor['options'].enableDLQ).toBe(true);
      expect(processor['options'].enableCircuitBreaker).toBe(true);
      expect(processor['options'].enableMetrics).toBe(true);
    });
  });
});
