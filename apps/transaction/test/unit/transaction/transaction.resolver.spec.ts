import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from '../../../src/modules/transaction/transaction.resolver';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import {
  TransactionResponseDto,
  TransactionSearchRequestDto,
} from 'apps/transaction/src/modules/transaction/dto/transaction.dto';
import { TransactionRegisterDto } from '@app/common';

describe('TransactionResolver', () => {
  let transactionResolver: TransactionResolver;
  let transactionServiceMock: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useFactory: () => ({
            searchTransactions: jest.fn(),
            registerTransaction: jest.fn(),
          }),
        },
      ],
    }).compile();

    transactionResolver = module.get<TransactionResolver>(TransactionResolver);
    transactionServiceMock = module.get<TransactionService>(
      TransactionService,
    ) as jest.Mocked<TransactionService>;
  });

  it('should be defined', () => {
    expect(transactionResolver).toBeDefined();
  });

  describe('searchTransactions', () => {
    it('should return an array of transactions based on search criteria', async () => {
      const transactionSearchRequestDto: TransactionSearchRequestDto = {
        transactionExternalId: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
      };

      const responseTransaction = {
        transactionExternalId: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
        transactionType: 'loan',
        transactionStatus: 'pending',
        value: 120,
        createdAt: new Date('2024-01-15T01:38:38.176Z'),
      };

      transactionServiceMock.searchTransactions.mockResolvedValueOnce([
        responseTransaction,
      ]);

      const result = await transactionResolver.searchTransactions(
        transactionSearchRequestDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual([responseTransaction]);
      expect(transactionServiceMock.searchTransactions).toHaveBeenCalledWith(
        transactionSearchRequestDto,
      );
    });
  });

  describe('registerTransaction', () => {
    it('should register a transaction and return the registered transaction', async () => {
      const transactionRegisterDto: TransactionRegisterDto = {
        accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
        accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
        tranferTypeId: 1,
        value: 103,
        transactionStatusId: 1,
        transactionExternalId: '',
      };
      const expectedResult: TransactionResponseDto = {
        id: 'a9f7a8e3-4f53-4b7c-a4c2-1a7d6f73b8c1',
        accountExternalIdDebit: 'd7b30cf2-2a63-4e2b-b6af-89a2c3e49b8f',
        accountExternalIdCredit: 'e4e35210-7d72-4d37-8e65-6f19e60a1a2d',
        tranferTypeId: 1,
        value: 103,
        transactionStatusId: 1,
      };

      transactionServiceMock.registerTransaction.mockResolvedValueOnce(
        expectedResult,
      );

      const result = await transactionResolver.registerTransaction(
        transactionRegisterDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      expect(transactionServiceMock.registerTransaction).toHaveBeenCalledWith(
        transactionRegisterDto,
      );
    });
  });
});
