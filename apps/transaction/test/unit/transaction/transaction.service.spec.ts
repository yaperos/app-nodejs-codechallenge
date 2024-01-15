import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { of } from 'rxjs';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { TransactionRepository } from '../../../src/modules/transaction/transaction.repository';
import { TransactionRegisterDto } from '@app/common';
import { Transaction } from 'apps/transaction/src/database/entities/transaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepositoryMock: jest.Mocked<TransactionRepository>;
  let kafkaClientMock: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useFactory: () => ({
            saveTransaction: jest.fn(),
            updateTransaction: jest.fn(),
            findTransactionById: jest.fn(),
            searchTransactions: jest.fn(),
          }),
        },
        {
          provide: 'ANTIFRAUD_KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(),
            fromEvent: jest.fn(() => of({})),
          }),
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepositoryMock = module.get<TransactionRepository>(
      TransactionRepository,
    ) as jest.Mocked<TransactionRepository>;
    kafkaClientMock = module.get<ClientKafka>(
      'ANTIFRAUD_KAFKA_CLIENT',
    ) as jest.Mocked<ClientKafka>;
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('registerTransaction', () => {
    it('should register a transaction', async () => {
      const transactionRegisterDto: TransactionRegisterDto = {
        accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
        accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
        tranferTypeId: 1,
        value: 103,
        transactionStatusId: 1,
        transactionExternalId: '',
      };

      const response: Transaction = {
        id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
        accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
        accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
        value: 103,
        createdAt: new Date('2024-01-15T01:38:38.176Z'),
        updatedAt: new Date('2024-01-15T01:38:38.176Z'),
        transactionStatus: {
          id: 1,
          name: 'pending',
          createdAt: new Date('2024-01-15T01:38:38.176Z'),
          updatedAt: new Date('2024-01-15T01:38:38.176Z'),
          transactions: [],
        },
        transactionStatusId: 1,
        transactionType: {
          id: 1,
          name: 'loan',
          createdAt: new Date('2024-01-15T01:38:38.176Z'),
          updatedAt: new Date('2024-01-15T01:38:38.176Z'),
          transactions: [],
        },
        tranferTypeId: 1,
        transactionExternalId: '',
      };

      transactionRepositoryMock.saveTransaction.mockResolvedValueOnce(response);

      const result = await transactionService.registerTransaction(
        transactionRegisterDto,
      );

      expect(result).toBeDefined();
      expect(result.id).toEqual('a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1');
      expect(transactionRepositoryMock.saveTransaction).toHaveBeenCalledWith(
        transactionRegisterDto,
      );
      expect(kafkaClientMock.emit).toHaveBeenCalledWith(
        'valid.transaction',
        expect.any(String),
      );
    });
    describe('updateTransaction', () => {
      it('should update a transaction and return the updated transaction', async () => {
        const updateTransactionDto: Transaction = {
          id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
          accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
          accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
          value: 103,
          createdAt: new Date('2024-01-15T01:38:38.176Z'),
          updatedAt: new Date('2024-01-15T01:38:38.176Z'),
          transactionStatus: {
            id: 1,
            name: 'pending',
            createdAt: new Date('2024-01-15T01:38:38.176Z'),
            updatedAt: new Date('2024-01-15T01:38:38.176Z'),
            transactions: [],
          },
          transactionStatusId: 2,
          transactionType: {
            id: 1,
            name: 'loan',
            createdAt: new Date('2024-01-15T01:38:38.176Z'),
            updatedAt: new Date('2024-01-15T01:38:38.176Z'),
            transactions: [],
          },
          tranferTypeId: 1,
          transactionExternalId: '',
        };

        const responseFind: Transaction = {
          id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
          accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
          accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
          value: 103,
          createdAt: new Date('2024-01-15T01:38:38.176Z'),
          updatedAt: new Date('2024-01-15T01:38:38.176Z'),
          transactionStatus: {
            id: 1,
            name: 'pending',
            createdAt: new Date('2024-01-15T01:38:38.176Z'),
            updatedAt: new Date('2024-01-15T01:38:38.176Z'),
            transactions: [],
          },
          transactionStatusId: 1,
          transactionType: {
            id: 1,
            name: 'loan',
            createdAt: new Date('2024-01-15T01:38:38.176Z'),
            updatedAt: new Date('2024-01-15T01:38:38.176Z'),
            transactions: [],
          },
          tranferTypeId: 1,
          transactionExternalId: '',
        };

        const requestUpdate = {
          id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
          transactionStatusId: 2,
        };

        transactionRepositoryMock.findTransactionById.mockResolvedValueOnce(
          responseFind,
        );
        transactionRepositoryMock.updateTransaction.mockResolvedValueOnce(
          updateTransactionDto,
        );

        const result =
          await transactionService.updateTransaction(requestUpdate);

        expect(result).toBeDefined();
        expect(result.transactionStatusId).toEqual(2);
        expect(
          transactionRepositoryMock.findTransactionById,
        ).toHaveBeenCalledWith(requestUpdate.id);
        expect(
          transactionRepositoryMock.updateTransaction,
        ).toHaveBeenCalledWith(updateTransactionDto);
      });

      it('should throw NotFoundException if the transaction is not found', async () => {
        const updateTransactionDto = {
          id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
          transactionStatusId: 2,
        };

        transactionRepositoryMock.findTransactionById.mockResolvedValueOnce(
          null,
        );

        await expect(
          transactionService.updateTransaction(updateTransactionDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
