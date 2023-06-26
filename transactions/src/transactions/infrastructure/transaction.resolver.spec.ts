import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import { TransactionFinder } from '@transactions/application/transaction.finder';
import { TransactionsResolver } from '@transactions/infrastructure/transactions.resolver';

describe(TransactionsResolver, () => {
  let resolver: TransactionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsResolver,
        {
          provide: TransactionCreator,
          useValue: {
            run: jest.fn(),
          },
        },
        {
          provide: TransactionFinder,
          useValue: {
            run: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
