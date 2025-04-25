import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction-repository';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { StatusTransaction } from './interfaces/status.interface';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockRepository = {
    getTransactionType: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockKafkaClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useValue: mockRepository },
        { provide: 'KAFKA_SERVICE', useValue: mockKafkaClient },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and emit Kafka event', async () => {
      const dto: CreateTransactionDto = {
        accountExternalIdDebit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        accountExternalIdCredit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transferTypeId: 1,
        value: 100,
      };

      const mockType = { transactionTypeName: 'YAPE' };
      const mockTransaction = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionStatus: 'pending',
        value: 100,
        createdAt: new Date(),
        transactionType: mockType,
      };

      mockRepository.getTransactionType.mockResolvedValue(mockType);
      mockRepository.create.mockResolvedValue(mockTransaction);

      const result = await service.create(dto);

      expect(mockRepository.getTransactionType).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockKafkaClient.emit).toHaveBeenCalledWith('transaction_created', {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        amount: 100,
      });

      expect(result).toEqual({
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionType: { name: 'YAPE' },
        transactionStatus: { name: 'pending' },
        value: 100,
        createdAt: mockTransaction.createdAt,
      });
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      const mockTransaction = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionStatus: 'approved',
        value: 300,
        createdAt: new Date(),
        transactionType: { transactionTypeName: 'YAPE' },
      };

      mockRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(
        'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      );

      expect(result).toEqual({
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionType: { name: 'YAPE' },
        transactionStatus: { name: 'approved' },
        value: 300,
        createdAt: mockTransaction.createdAt,
      });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('notfound')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the transaction status', async () => {
      const dto: UpdateTransactionDto = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionStatus: 'rejected' as StatusTransaction,
      };

      const mockTransaction = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionStatus: 'approved',
        value: 200,
        createdAt: new Date(),
        transactionType: { transactionTypeName: 'YAPE' },
      };

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.updateStatus.mockResolvedValue(undefined);

      const result = await service.updateStatus(dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith(
        'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      );
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        'rejected',
      );

      expect(result).toEqual({
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionType: { name: 'YAPE' },
        transactionStatus: { name: 'rejected' },
        value: 200,
        createdAt: mockTransaction.createdAt,
      });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const dto: UpdateTransactionDto = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        transactionStatus: 'rejected' as StatusTransaction,
      };

      await expect(service.updateStatus(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
