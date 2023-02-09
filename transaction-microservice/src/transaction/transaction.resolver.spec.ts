// test transaction resolver

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './services/transaction.service';

import { TransactionResolver } from './transaction.resolver';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: {
            getTransaction: jest.fn().mockResolvedValue({ id: 1 }),
            getTransactions: jest.fn().mockResolvedValue([]),
            createTransaction: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return transaction', async () => {
    const transaction = await resolver.getTransaction({
      transactionExternalId: 'abc',
    });
    expect(transaction).toEqual({ id: 1 });
  });

  it('should return transactions', async () => {
    const transactions = await resolver.getTransactions();
    expect(transactions).toEqual([]);
  });

  it('should create transaction', async () => {
    const transaction = await resolver.createTransaction({
      value: 100,
      accountExternalIdCredit: 'some',
      accountExternalIdDebit: 'some',
      tranferTypeId: 1,
    });
    expect(transaction).toEqual({ id: 1 });
  });
});
