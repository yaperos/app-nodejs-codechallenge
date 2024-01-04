import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transaction.resolver';
import { TransactionsService } from './transaction.service';

describe('TransactionResolver', () => {
  let resolver: TransactionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsResolver, TransactionsService],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
