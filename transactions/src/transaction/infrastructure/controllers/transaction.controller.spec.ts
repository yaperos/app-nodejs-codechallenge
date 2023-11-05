import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionServiceInterface } from '../../domain/interfaces/transaction.service.interface';
import { CreateTransactionDto } from '../dto/transaction.create.dto';
import { TransactionDto } from 'src/transaction/infrastructure/dto/transaction.dto';
import { UpdateTransactionDto } from 'src/transaction/infrastructure/dto/transaction.update.dto';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: 'TransactionService',
          useValue: {
            getById: jest.fn(),
            create: jest.fn(),
            reject: jest.fn(),
            approve: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService =
      module.get<TransactionServiceInterface>('TransactionService');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getById', () => {
    it('should return a transaction by ID', async () => {
      const mockTransaction: Transaction = {
        id: 1,
        accountExternalIdDebit: 'UID',
        accountExternalIdCredit: 'UID',
        tranferTypeId: 1,
        value: 100,
        createdAt: new Date(),
        status: 'pending',
      };
      const mockTransactionResult: TransactionDto = {
        id: 1,
        transactionExternalId: 'UID',
        transactionType: {
          name: '1',
        },
        transactionStatus: {
          name: 'pending',
        },
        value: 100,
        createdAt: new Date(),
      };

      transactionService.getById = jest.fn().mockResolvedValue(mockTransaction);

      const result = await controller.getById(1);
      expect(result).toEqual(mockTransactionResult);
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: 'UID',
        accountExternalIdCredit: 'UID',
        tranferTypeId: 1,
        value: 100,
      };

      const mockTransaction: Transaction = {
        id: 1,
        accountExternalIdDebit: 'UID',
        accountExternalIdCredit: 'UID',
        tranferTypeId: 1,
        value: 100,
        createdAt: new Date(),
        status: 'pending',
      };
      const mockTransactionResult: TransactionDto = {
        id: 1,
        transactionExternalId: 'UID',
        transactionType: {
          name: '1',
        },
        transactionStatus: {
          name: 'pending',
        },
        value: 100,
        createdAt: new Date(),
      };

      transactionService.create = jest.fn().mockResolvedValue(mockTransaction);

      const result = await controller.create(createTransactionDto);
      expect(result).toEqual(mockTransactionResult);
    });
  });

  describe('reject', () => {
    it('should reject a transaction', async () => {
      const updateTransactionDto: UpdateTransactionDto = {
        id: 1,
      };

      const mockTransaction: Transaction = {
        id: 1,
        accountExternalIdDebit: 'UID',
        accountExternalIdCredit: 'UID',
        tranferTypeId: 1,
        value: 100,
        createdAt: new Date(),
        status: 'rejected',
      };
      const mockTransactionResult: TransactionDto = {
        id: 1,
        transactionExternalId: 'UID',
        transactionType: {
          name: '1',
        },
        transactionStatus: {
          name: 'rejected',
        },
        value: 100,
        createdAt: new Date(),
      };

      transactionService.reject = jest.fn().mockResolvedValue(mockTransaction);

      const result = await controller.reject(updateTransactionDto);
      expect(result).toEqual(mockTransactionResult);
    });
  });

  describe('approve', () => {
    it('should approve a transaction', async () => {
      const updateTransactionDto: UpdateTransactionDto = {
        id: 1,
      };

      const mockTransaction: Transaction = {
        id: 1,
        accountExternalIdDebit: 'UID',
        accountExternalIdCredit: 'UID',
        tranferTypeId: 1,
        value: 100,
        createdAt: new Date(),
        status: 'approved',
      };
      const mockTransactionResult: TransactionDto = {
        id: 1,
        transactionExternalId: 'UID',
        transactionType: {
          name: '1',
        },
        transactionStatus: {
          name: 'approved',
        },
        value: 100,
        createdAt: new Date(),
      };

      transactionService.approve = jest.fn().mockResolvedValue(mockTransaction);

      const result = await controller.approve(updateTransactionDto);
      expect(result).toEqual(mockTransactionResult);
    });
  });
});
