import { Test, TestingModule } from '@nestjs/testing';
import { TransactionQuery } from './transaction.query';

describe('TransactionQuery', () => {
  let service: TransactionQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionQuery],
    }).compile();

    service = module.get<TransactionQuery>(TransactionQuery);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
