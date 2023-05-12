import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transaction saved', () => {
    const transaction = {
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      tranferTypeId: 1,
      value: 1200,
    };
    // const response = service.save(transaction);
    // response.then((transactionSaved) => {
      expect(service.save(transaction)).toEqual('pending');
    // });
  });
});
