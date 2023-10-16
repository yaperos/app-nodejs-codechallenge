import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '../../../../src/database/entities/transaction.entity';
import { TransactionDBService } from '../../../../src/modules/db-module/transaction-db/transaction.db.service';
import { Repository } from 'typeorm';
import {
  mockTransaction,
  mockTransactionExternalId,
  mockTransactionStatus,
} from '../../transaction/mock-data';

describe('transactionDBService', () => {
  let dbService: TransactionDBService;
  let spyTransactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionDBService,
        {
          provide: 'TransactionRepository',
          useFactory: () => ({
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    dbService = testingModule.get<TransactionDBService>(TransactionDBService);
    spyTransactionRepository = testingModule.get<Repository<Transaction>>(
      'TransactionRepository',
    );
  });

  it('Should be defined', () => {
    expect(dbService).toBeDefined();
  });

  describe('call method from TransactionRepository', () => {
    it('should save a transaction', async () => {
      await dbService.createTransaction(mockTransaction);
      expect(spyTransactionRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should update a transaction', async () => {
      await dbService.updateTransactionByCriteria(
        { transactionExternalId: mockTransactionExternalId },
        { transactionStatus: mockTransactionStatus },
      );
      expect(spyTransactionRepository.update).toHaveBeenCalledTimes(1);
    });
    it('should find a transaction by external id', async () => {
      await dbService.findTransactionByExternalId(mockTransactionExternalId);
      expect(spyTransactionRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
