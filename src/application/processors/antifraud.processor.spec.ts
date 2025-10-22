import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { AntifraudProcessor } from './antifraud.processor';
import { AntifraudService } from '../services/antifraud.service';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { Queue, Job } from 'bull';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

describe('AntifraudProcessor', () => {
  let processor: AntifraudProcessor;
  let antifraudService: jest.Mocked<AntifraudService>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let mockAntifraudQueue: jest.Mocked<Queue>;
  let mockTransactionQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    mockAntifraudQueue = {
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

    mockTransactionQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
    } as unknown as jest.Mocked<Queue>;

    antifraudService = {
      checkTransaction: jest.fn(),
    } as unknown as jest.Mocked<AntifraudService>;

    transactionRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudProcessor,
        {
          provide: getQueueToken('antifraud'),
          useValue: mockAntifraudQueue,
        },
        {
          provide: getQueueToken('transactions'),
          useValue: mockTransactionQueue,
        },
        {
          provide: AntifraudService,
          useValue: antifraudService,
        },
        {
          provide: 'ITransactionRepository',
          useValue: transactionRepository,
        },
      ],
    }).compile();

    processor = module.get<AntifraudProcessor>(AntifraudProcessor);
  });

  describe('processJob', () => {
    it('should process antifraud check and approve transaction', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-1',
        data: {
          transactionId: 'txn-123',
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      antifraudService.checkTransaction.mockResolvedValue({
        approved: true,
        score: 25,
      } as any);

      const result = await processor['processJob'](mockJob as Job);

      expect(antifraudService.checkTransaction).toHaveBeenCalledWith('txn-123');
      expect(result).toEqual({
        success: true,
        transactionId: 'txn-123',
        result: {
          approved: true,
          score: 25,
        },
        processedAt: expect.any(String),
      });
    });

    it('should process antifraud check and reject transaction', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-2',
        data: {
          transactionId: 'txn-456',
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      antifraudService.checkTransaction.mockResolvedValue({
        approved: false,
        score: 85,
      } as any);

      const result = await processor['processJob'](mockJob as Job);

      expect(antifraudService.checkTransaction).toHaveBeenCalledWith('txn-456');
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('transactionId', 'txn-456');
      expect((result as any).result.approved).toBe(false);
    });
  });

  describe('handleAntifraudCheck', () => {
    it('should delegate to base class process method', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-3',
        data: {
          transactionId: 'txn-789',
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
      };

      antifraudService.checkTransaction.mockResolvedValue({
        approved: true,
        score: 30,
      } as any);

      const result = await processor.handleAntifraudCheck(mockJob as Job);

      expect(result).toBeDefined();
    });
  });

  describe('handleProcessApprovedTransaction', () => {
    it('should process approved transaction successfully', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-4',
        data: {
          transactionId: 'txn-111',
          antifraudScore: 20,
        },
      };

      const mockTransaction = new Transaction({
        id: 'txn-111',
        externalId: 'ext-111',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
        antifraudStatus: 'APPROVED',
        antifraudScore: 20,
      });

      transactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await processor.handleProcessApprovedTransaction(mockJob as Job);

      expect(transactionRepository.findById).toHaveBeenCalledWith('txn-111');
      expect(mockTransactionQueue.add).toHaveBeenCalledWith(
        'process-transaction',
        {
          transactionId: 'txn-111',
          antifraudApproved: true,
          antifraudScore: 20,
        },
        expect.objectContaining({
          attempts: 3,
        })
      );
      expect(result).toEqual({
        success: true,
        transactionId: 'txn-111',
        antifraudScore: 20,
        sentToProcessing: true,
        processedAt: expect.any(String),
      });
    });

    it('should throw error when transaction not found', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-5',
        data: {
          transactionId: 'txn-999',
          antifraudScore: 20,
        },
      };

      transactionRepository.findById.mockResolvedValue(null);

      await expect(
        processor.handleProcessApprovedTransaction(mockJob as Job)
      ).rejects.toThrow('Transaction txn-999 not found');

      expect(transactionRepository.findById).toHaveBeenCalledWith('txn-999');
    });

    it('should throw error when transaction is not approved', async () => {
      const mockJob: Partial<Job> = {
        id: 'job-6',
        data: {
          transactionId: 'txn-222',
          antifraudScore: 90,
        },
      };

      const mockTransaction = new Transaction({
        id: 'txn-222',
        externalId: 'ext-222',
        type: TransactionType.P2P,
        amount: 100,
        currency: 'PEN',
        sourceAccountId: 'src',
        targetAccountId: 'tgt',
        status: TransactionStatus.PENDING,
        metadata: {},
        retryCount: 0,
        antifraudStatus: 'REJECTED',
        antifraudScore: 90,
      });

      transactionRepository.findById.mockResolvedValue(mockTransaction);

      await expect(
        processor.handleProcessApprovedTransaction(mockJob as Job)
      ).rejects.toThrow(
        'Transaction txn-222 is not approved by antifraud (status: REJECTED)'
      );

      expect(transactionRepository.findById).toHaveBeenCalledWith('txn-222');
    });
  });

  describe('constructor', () => {
    it('should initialize with correct queue options', () => {
      expect(processor).toBeDefined();
      expect(processor['options'].queueName).toBe('antifraud');
      expect(processor['options'].enableDLQ).toBe(true);
      expect(processor['options'].enableCircuitBreaker).toBe(true);
      expect(processor['options'].enableMetrics).toBe(true);
    });
  });
});
