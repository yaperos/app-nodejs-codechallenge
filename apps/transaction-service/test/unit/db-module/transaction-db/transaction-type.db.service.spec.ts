import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '../../../../src/database/entities/transaction-type.entity';
import { TransactionTypeDBService } from '../../../../src/modules/db-module/transaction-db/transaction-type.db.service';
import { Repository } from 'typeorm';

describe('transactionTypeDBService', () => {
  let dbService: TransactionTypeDBService;
  let spyTransactionTypeRepository: Repository<TransactionType>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionTypeDBService,
        {
          provide: 'TransactionTypeRepository',
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    dbService = testingModule.get<TransactionTypeDBService>(
      TransactionTypeDBService,
    );
    spyTransactionTypeRepository = testingModule.get<
      Repository<TransactionType>
    >('TransactionTypeRepository');
  });

  it('Should be defined', () => {
    expect(dbService).toBeDefined();
  });

  describe('call method from TransactionTypeRepository', () => {
    it('should find a transaction by external id', async () => {
      await dbService.findTransactionTypeById(1);
      expect(spyTransactionTypeRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
