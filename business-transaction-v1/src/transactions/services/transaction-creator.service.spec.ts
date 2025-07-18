import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { of, throwError } from 'rxjs';

import { TransactionCreatorService } from './transaction-creator.service';
import { Transaction } from '../transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { ApplicationPropertiesService } from '../../config/application-properties.service';
import { ReactiveKafkaProducer } from '../../kafka/kafka-producer.service';
import { kafkaConfig } from '../../config/kafka.config';

// Mock UUID
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234'
}));

describe('TransactionCreatorService', () => {
  let service: TransactionCreatorService;
  let repository: jest.Mocked<Repository<Transaction>>;
  let applicationProperties: jest.Mocked<ApplicationPropertiesService>;
  let kafkaProducer: jest.Mocked<ReactiveKafkaProducer>;
  let kafkaConfiguration: ConfigType<typeof kafkaConfig>;

  // Test data
  const mockCreateTransactionDto: CreateTransactionDto = {
    accountExternalIdDebit: '123e4567-e89b-12d3-a456-426614174000',
    accountExternalIdCredit: '987fcdeb-51a2-43d1-b789-123456789abc',
    transactionTypeCode: '220',
    amount: 100.50
  };

  const mockTransaction: Transaction = {
    id: 'mocked-uuid-1234',
    accountExternalIdDebit: '123e4567-e89b-12d3-a456-426614174000',
    accountExternalIdCredit: '987fcdeb-51a2-43d1-b789-123456789abc',
    transactionTypeCode: '220',
    amount: 100.50,
    status: 'PENDING',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  };

  const mockTrxStatuses = {
    pending: 'PENDING',
    approved: 'APPROVED',
    rejected: 'REJECTED'
  };

  beforeEach(async () => {
    // Mock repository
    const mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    // Mock ApplicationPropertiesService
    const mockApplicationProperties = {
      getTrxStatuses: jest.fn(),
      getTransactionTypeDescription: jest.fn()
    };

    // Mock ReactiveKafkaProducer
    const mockKafkaProducer = {
      sendMessage: jest.fn()
    };

    // Mock Kafka configuration
    const mockKafkaConfig = {
      producer: {
        topic: 'transaction-anti-fraud-validation'
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCreatorService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository
        },
        {
          provide: ApplicationPropertiesService,
          useValue: mockApplicationProperties
        },
        {
          provide: ReactiveKafkaProducer,
          useValue: mockKafkaProducer
        },
        {
          provide: kafkaConfig.KEY,
          useValue: mockKafkaConfig
        }
      ],
    }).compile();

    service = module.get<TransactionCreatorService>(TransactionCreatorService);
    repository = module.get(getRepositoryToken(Transaction));
    applicationProperties = module.get(ApplicationPropertiesService);
    kafkaProducer = module.get(ReactiveKafkaProducer);
    kafkaConfiguration = module.get(kafkaConfig.KEY);

    // Setup default mocks
    applicationProperties.getTrxStatuses.mockReturnValue(mockTrxStatuses);
    repository.save.mockResolvedValue(mockTransaction);
    kafkaProducer.sendMessage.mockReturnValue(of(void 0));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrx', () => {
    it('should create transaction successfully', async () => {
      // Act
      const result = await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.transactionExternalId).toBe('mocked-uuid-1234');
      
      // Verify repository was called
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mocked-uuid-1234',
        accountExternalIdDebit: mockCreateTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: mockCreateTransactionDto.accountExternalIdCredit,
        transactionTypeCode: mockCreateTransactionDto.transactionTypeCode,
        amount: mockCreateTransactionDto.amount,
        status: 'PENDING'
      }));

      // Verify Kafka message was sent
      expect(kafkaProducer.sendMessage).toHaveBeenCalledWith(
        'transaction-anti-fraud-validation',
        'mocked-uuid-1234',
        expect.stringContaining('"id":"mocked-uuid-1234"')
      );
    });

    it('should use application properties for transaction status', async () => {
      // Act
      await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(applicationProperties.getTrxStatuses).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        status: 'PENDING'
      }));
    });

    it('should set created and updated timestamps', async () => {
      // Arrange
      const fixedDate = new Date('2024-01-01T10:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);

      // Act
      await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        createdAt: fixedDate,
        updatedAt: fixedDate
      }));

      // Cleanup
      jest.restoreAllMocks();
    });

    it('should handle database save error', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      repository.save.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.createTrx(mockCreateTransactionDto))
        .rejects
        .toThrow(InternalServerErrorException);

      expect(repository.save).toHaveBeenCalled();
    });

    it('should complete transaction even if Kafka fails', async () => {
      // Arrange
      kafkaProducer.sendMessage.mockReturnValue(throwError(() => new Error('Kafka connection failed')));

      // Act
      const result = await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.transactionExternalId).toBe('mocked-uuid-1234');
      expect(repository.save).toHaveBeenCalled();
      expect(kafkaProducer.sendMessage).toHaveBeenCalled();
    });

    it('should generate unique UUID for each transaction', async () => {
      // Act
      await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mocked-uuid-1234'
      }));
    });

    it('should send correct Kafka message format', async () => {
      // Act
      await service.createTrx(mockCreateTransactionDto);

      // Assert
      expect(kafkaProducer.sendMessage).toHaveBeenCalledWith(
        'transaction-anti-fraud-validation',
        'mocked-uuid-1234',
        expect.stringMatching(/"id":"mocked-uuid-1234".*"amount":100.5/)
      );
    });
  });

  describe('buildTransactionEntity (private method)', () => {
    it('should build transaction entity with correct properties', () => {
      // Act - Access private method via type assertion
      const result = (service as any).buildTransactionEntity(mockCreateTransactionDto);

      // Assert
      expect(result).toBeInstanceOf(Transaction);
      expect(result.id).toBe('mocked-uuid-1234');
      expect(result.accountExternalIdDebit).toBe(mockCreateTransactionDto.accountExternalIdDebit);
      expect(result.accountExternalIdCredit).toBe(mockCreateTransactionDto.accountExternalIdCredit);
      expect(result.transactionTypeCode).toBe(mockCreateTransactionDto.transactionTypeCode);
      expect(result.amount).toBe(mockCreateTransactionDto.amount);
      expect(result.status).toBe('PENDING');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('saveTransaction (private method)', () => {
    it('should save transaction successfully', async () => {
      // Arrange
      const transactionEntity = new Transaction();

      // Act
      const result = await (service as any).saveTransaction(transactionEntity);

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(repository.save).toHaveBeenCalledWith(transactionEntity);
    });

    it('should handle database errors', async () => {
      // Arrange
      const transactionEntity = new Transaction();
      const dbError = new Error('Database error');
      repository.save.mockRejectedValue(dbError);

      // Act & Assert
      await expect((service as any).saveTransaction(transactionEntity))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('buildTransactionResponse (private method)', () => {
    it('should build response DTO correctly', () => {
      // Act
      const result = (service as any).buildTransactionResponse(mockTransaction);

      // Assert
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.transactionExternalId).toBe(mockTransaction.id);
    });
  });

  describe('sendMessage (private method)', () => {
    it('should send Kafka message successfully', async () => {
      // Act
      await (service as any).sendMessage(mockTransaction);

      // Assert
      expect(kafkaProducer.sendMessage).toHaveBeenCalledWith(
        'transaction-anti-fraud-validation',
        'mocked-uuid-1234',
        expect.stringContaining('"id":"mocked-uuid-1234"')
      );
    });

    it('should handle Kafka errors gracefully', async () => {
      // Arrange
      kafkaProducer.sendMessage.mockReturnValue(throwError(() => new Error('Kafka error')));

      // Act & Assert - Should not throw
      await expect((service as any).sendMessage(mockTransaction))
        .resolves
        .toBeUndefined();
    });
  });

  describe('convertTransactionToJson (private method)', () => {
    it('should convert transaction to JSON correctly', () => {
      // Act
      const result = (service as any).convertTransactionToJson(mockTransaction);

      // Assert
      const parsedResult = JSON.parse(result);
      expect(parsedResult.id).toBe(mockTransaction.id);
      expect(parsedResult.amount).toBe(mockTransaction.amount);
    });

    it('should handle JSON conversion errors', () => {
      // Arrange - Mock JSON.stringify to throw
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('JSON conversion failed');
      });

      try {
        // Act & Assert
        expect(() => (service as any).convertTransactionToJson(mockTransaction))
          .toThrow(InternalServerErrorException);
      } finally {
        // Cleanup - Restore original JSON.stringify
        JSON.stringify = originalStringify;
      }
    });
  });

  describe('Integration Tests', () => {
    it('should complete full transaction creation flow', async () => {
      // Act
      const result = await service.createTrx(mockCreateTransactionDto);

      // Assert - Verify the complete flow
      expect(applicationProperties.getTrxStatuses).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(kafkaProducer.sendMessage).toHaveBeenCalled();
      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.transactionExternalId).toBe('mocked-uuid-1234');
    });

    it('should maintain transaction data integrity throughout the flow', async () => {
      // Act
      const result = await service.createTrx(mockCreateTransactionDto);

      // Assert - Verify data consistency
      const savedTransactionCall = repository.save.mock.calls[0][0];
      const kafkaMessageCall = kafkaProducer.sendMessage.mock.calls[0];

      // Check saved transaction
      expect(savedTransactionCall.accountExternalIdDebit).toBe(mockCreateTransactionDto.accountExternalIdDebit);
      expect(savedTransactionCall.accountExternalIdCredit).toBe(mockCreateTransactionDto.accountExternalIdCredit);
      expect(savedTransactionCall.amount).toBe(mockCreateTransactionDto.amount);

      // Check Kafka message contains transaction ID
      expect(kafkaMessageCall[1]).toBe(savedTransactionCall.id); // Key
      expect(kafkaMessageCall[2]).toContain(savedTransactionCall.id); // Message content

      // Check response
      expect(result.transactionExternalId).toBe(savedTransactionCall.id);
    });

    it('should handle all error scenarios appropriately', async () => {
      // Test 1: Database error should propagate
      repository.save.mockRejectedValueOnce(new Error('DB Error'));
      await expect(service.createTrx(mockCreateTransactionDto))
        .rejects.toThrow(InternalServerErrorException);

      // Reset mocks
      repository.save.mockResolvedValue(mockTransaction);

      // Test 2: Kafka error should not fail transaction
      kafkaProducer.sendMessage.mockReturnValueOnce(throwError(() => new Error('Kafka Error')));
      const result = await service.createTrx(mockCreateTransactionDto);
      expect(result).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transaction amounts', async () => {
      // Arrange
      const emptyAmountDto = { ...mockCreateTransactionDto, amount: 0 };

      // Act
      const result = await service.createTrx(emptyAmountDto);

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        amount: 0
      }));
    });

    it('should handle large transaction amounts', async () => {
      // Arrange
      const largeAmountDto = { ...mockCreateTransactionDto, amount: 999999.99 };

      // Act
      const result = await service.createTrx(largeAmountDto);

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        amount: 999999.99
      }));
    });

    it('should handle different transaction type codes', async () => {
      // Arrange
      const differentTypeDto = { ...mockCreateTransactionDto, transactionTypeCode: '225' };

      // Act
      const result = await service.createTrx(differentTypeDto);

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        transactionTypeCode: '225'
      }));
    });
  });
});
