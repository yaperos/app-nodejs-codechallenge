import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionResolver, TransactionService],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
