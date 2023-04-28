import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatusResolver } from './transaction-status.resolver';
import { TransactionStatusService } from './transaction-status.service';

describe('TransactionStatusResolver', () => {
  let resolver: TransactionStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionStatusResolver, TransactionStatusService],
    }).compile();

    resolver = module.get<TransactionStatusResolver>(TransactionStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
