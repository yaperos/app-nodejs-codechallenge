import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from 'src/adapters/database/mongo/transactions/transactions.repository';
import {
  TransactionStatus,
  Transactions,
} from 'src/adapters/database/mongo/transactions/transactions.schema';
import { TransactionsDto, TransactionsUpdateDto } from './dto';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: TransactionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getTransactionById: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<TransactionsRepository>(
      TransactionsRepository,
    );
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const transactionsDto: TransactionsDto = {
        accountExternalIdDebit: 'GUI',
        accountExternalIdCredit: 'GUI',
        transferTypeId: '1',
        value: 500,
        transactionStatus: {
          name: TransactionStatus.PENDING,
        },
        transactionType: {
          name: 'credit',
        },
      };

      const createdTransaction: Transactions = {
        accountExternalIdDebit: 'GUI',
        accountExternalIdCredit: 'GUI',
        transferTypeId: '1',
        value: 500,
        transactionStatus: {
          name: TransactionStatus.PENDING,
        },
        transactionType: {
          name: 'credit',
        },
        transactionExternalId: '203637f8-1e8c-49b1-9931-8bf31413b8e1',
        createdAt: new Date('2023-05-28T05:13:14.815Z'),
        updatedAt: new Date('2023-05-28T05:13:14.815Z'),
      };

      jest
        .spyOn(transactionsRepository, 'create')
        .mockResolvedValueOnce(createdTransaction);

      const result = await transactionsService.createTransaction(
        transactionsDto,
      );

      expect(transactionsRepository.create).toHaveBeenCalledWith(
        transactionsDto,
      );
      expect(result).toEqual(createdTransaction);
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const transactionsDto = {
        accountExternalIdDebit: 'GUI',
        accountExternalIdCredit: 'GUI',
        transferTypeId: '1',
        value: 500,
        transactionStatus: {
          name: TransactionStatus.PENDING,
        },
        transactionType: {
          name: 'credit',
        },
      };

      const error = new Error('Test Error');

      jest.spyOn(transactionsRepository, 'create').mockRejectedValueOnce(error);

      await expect(
        transactionsService.createTransaction(transactionsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update the status of a transaction', async () => {
      const transactionExternalId = '203637f8-1e8c-49b1-9931-8bf31413b8e1';
      const status = TransactionStatus.APPROVED;

      const transactionsUpdateDto: TransactionsUpdateDto = {
        transactionExternalId: '203637f8-1e8c-49b1-9931-8bf31413b8e1',
        transactionStatus: {
          name: TransactionStatus.APPROVED,
        },
      };

      const updatedTransaction: Transactions = {
        accountExternalIdDebit: 'GUI',
        accountExternalIdCredit: 'GUI',
        transferTypeId: '1',
        value: 500,
        transactionStatus: {
          name: TransactionStatus.APPROVED,
        },
        transactionType: {
          name: 'credit',
        },
        transactionExternalId: '203637f8-1e8c-49b1-9931-8bf31413b8e1',
        createdAt: new Date('2023-05-28T05:13:14.815Z'),
        updatedAt: new Date('2023-05-28T05:13:14.815Z'),
      };

      jest
        .spyOn(transactionsRepository, 'update')
        .mockResolvedValueOnce(updatedTransaction);

      const result = await transactionsService.updateTransactionStatus(
        transactionExternalId,
        status,
      );

      expect(transactionsRepository.update).toHaveBeenCalledWith(
        transactionExternalId,
        transactionsUpdateDto,
      );
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const transactionExternalId = '203637f8-1e8c-49b1-9931-8bf31413b8e1';
      const status = TransactionStatus.APPROVED;

      const error = new Error('Test Error');

      jest.spyOn(transactionsRepository, 'update').mockRejectedValueOnce(error);

      await expect(
        transactionsService.updateTransactionStatus(
          transactionExternalId,
          status,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getTransactionById', () => {
    it('should retrieve a transaction by its external id', async () => {
      const transactionExternalId = '203637f8-1e8c-49b1-9931-8bf31413b8e1';

      const expectedTransaction: Transactions = {
        accountExternalIdDebit: 'GUI',
        accountExternalIdCredit: 'GUI',
        transferTypeId: '1',
        value: 500,
        transactionStatus: {
          name: TransactionStatus.APPROVED,
        },
        transactionType: {
          name: 'credit',
        },
        transactionExternalId: '203637f8-1e8c-49b1-9931-8bf31413b8e1',
        createdAt: new Date('2023-05-28T05:13:14.815Z'),
        updatedAt: new Date('2023-05-28T05:13:14.815Z'),
      };

      jest
        .spyOn(transactionsRepository, 'getTransactionById')
        .mockResolvedValueOnce(expectedTransaction);

      const result = await transactionsService.getTransactionById(
        transactionExternalId,
      );

      expect(transactionsRepository.getTransactionById).toHaveBeenCalledWith(
        transactionExternalId,
      );
      expect(result).toEqual(expectedTransaction);
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const transactionExternalId = 'test-id';

      const error = new Error('Test Error');

      jest
        .spyOn(transactionsRepository, 'getTransactionById')
        .mockRejectedValueOnce(error);

      await expect(
        transactionsService.getTransactionById(transactionExternalId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getTransactions', () => {
    it('should retrieve all transactions', async () => {
      const expectedTransactions: Transactions[] = [
        {
          accountExternalIdDebit: 'GUI',
          accountExternalIdCredit: 'GUI',
          transferTypeId: '1',
          value: 500,
          transactionStatus: {
            name: TransactionStatus.APPROVED,
          },
          transactionType: {
            name: 'credit',
          },
          transactionExternalId: '203637f8-1e8c-49b1-9931-8bf31413b8e1',
          createdAt: new Date('2023-05-28T05:13:14.815Z'),
          updatedAt: new Date('2023-05-28T05:13:14.815Z'),
        },
      ];

      jest
        .spyOn(transactionsRepository, 'getAll')
        .mockResolvedValueOnce(expectedTransactions);

      const result = await transactionsService.getTransactions();

      expect(transactionsRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedTransactions);
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const error = new Error('Test Error');

      jest.spyOn(transactionsRepository, 'getAll').mockRejectedValueOnce(error);

      await expect(transactionsService.getTransactions()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
