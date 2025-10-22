import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../database/entities/transaction.entity';
import { TransactionType } from '../../database/entities/transaction-type.entity';
import { TransactionStatus } from '../../database/entities/transaction-status.entity';
import { CreateTransactionInput } from './input/create-transaction.input';
import { KafkaService } from '../../common/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;
  let transactionTypeRepository: Repository<TransactionType>;
  let transactionStatusRepository: Repository<TransactionStatus>;
  let kafkaService: KafkaService;

  const mockTransactionType = {
    id: 1,
    name: 'Transfer',
  };

  const mockTransactionStatus = {
    id: 1,
    name: 'pending',
  };

  const mockTransaction: Transaction = {
    id: '1',
    transactionExternalId: 'test-uuid',
    accountExternalIdDebit: 'debit-uuid',
    accountExternalIdCredit: 'credit-uuid',
    transferTypeId: 1,
    value: 100,
    transactionTypeId: 1,
    transactionStatusId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionType: mockTransactionType,
    transactionStatus: mockTransactionStatus,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TransactionType),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TransactionStatus),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-topic'),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction)
    );
    transactionTypeRepository = module.get<Repository<TransactionType>>(
      getRepositoryToken(TransactionType)
    );
    transactionStatusRepository = module.get<Repository<TransactionStatus>>(
      getRepositoryToken(TransactionStatus)
    );
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const input: CreateTransactionInput = {
        accountExternalIdDebit: 'debit-uuid',
        accountExternalIdCredit: 'credit-uuid',
        tranferTypeId: 1,
        value: 100,
      };

      jest
        .spyOn(transactionStatusRepository, 'findOne')
        .mockResolvedValue(mockTransactionStatus);
      jest
        .spyOn(transactionTypeRepository, 'findOne')
        .mockResolvedValue(mockTransactionType);
      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValue(mockTransaction);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(mockTransaction);
      jest.spyOn(kafkaService, 'sendMessage').mockResolvedValue(undefined);

      const result = await service.createTransaction(input);

      expect(result.transactionExternalId).toBe('test-uuid');
      expect(result.value).toBe(100);
      expect(kafkaService.sendMessage).toHaveBeenCalled();
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction when found', async () => {
      const transactionWithRelations = {
        ...mockTransaction,
        transactionType: mockTransactionType,
        transactionStatus: mockTransactionStatus,
      };

      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(transactionWithRelations);

      const result = await service.getTransaction('test-uuid');

      expect(result.transactionExternalId).toBe('test-uuid');
      expect(result.transactionType.name).toBe('Transfer');
    });

    it('should throw NotFoundException when transaction not found', async () => {
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getTransaction('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status successfully', async () => {
      const approvedStatus = { id: 2, name: 'approved' };

      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(mockTransaction);
      jest
        .spyOn(transactionStatusRepository, 'findOne')
        .mockResolvedValue(approvedStatus);
      jest.spyOn(transactionRepository, 'update').mockResolvedValue(undefined);

      await service.updateTransactionStatus('test-uuid', 'approved');

      expect(transactionRepository.update).toHaveBeenCalledWith(
        { transactionExternalId: 'test-uuid' },
        { transactionStatusId: 2 }
      );
    });
  });
});
