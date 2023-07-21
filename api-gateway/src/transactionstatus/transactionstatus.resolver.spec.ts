import { Test, TestingModule } from '@nestjs/testing';
import { TransactionstatusResolver } from './transactionstatus.resolver';
import { TransactionstatusService } from './transactionstatus.service';

describe('TransactionstatusResolver', () => {
  let resolver: TransactionstatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionstatusResolver, TransactionstatusService],
    }).compile();

    resolver = module.get<TransactionstatusResolver>(TransactionstatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
