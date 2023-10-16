import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatus } from '../../../../src/database/entities/transaction-status.entity';
import { TransactionStatusDBService } from '../../../../src/modules/db-module/transaction-db/transaction-status.db.service';
import { Repository } from 'typeorm';

describe('transactionTypeDBService', () => {
  let dbService: TransactionStatusDBService;
  let spyTransactionTypeRepository: Repository<TransactionStatus>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionStatusDBService,
        {
          provide: 'TransactionStatusRepository',
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    dbService = testingModule.get<TransactionStatusDBService>(
      TransactionStatusDBService,
    );
    spyTransactionTypeRepository = testingModule.get<
      Repository<TransactionStatus>
    >('TransactionStatusRepository');
  });

  it('Should be defined', () => {
    expect(dbService).toBeDefined();
  });

  describe('call method from TransactionStatusRepository', () => {
    it('should find a transaction by external id', async () => {
      await dbService.findTransactionStatusById(1);
      expect(spyTransactionTypeRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
