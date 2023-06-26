import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import { TransactionFinder } from '@transactions/application/transaction.finder';
import { transactionMock } from '@transactions/domain/transaction.mock';
import { TransactionsResolver } from '@transactions/infrastructure/transactions.resolver';
import { transactionRequestMock } from './dtos/transaction-request.mock';

describe(TransactionsResolver, () => {
  let resolver: TransactionsResolver;
  let transactionCreator: TransactionCreator;
  let transactionFinder: TransactionFinder;

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
    transactionCreator = module.get<TransactionCreator>(TransactionCreator);
    transactionFinder = module.get<TransactionFinder>(TransactionFinder);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a transaction', async () => {
    jest.spyOn(transactionCreator, 'run').mockResolvedValue(transactionMock);

    const transaction = await resolver.createTransaction(transactionRequestMock);

    expect(transactionCreator.run).toBeCalledWith(transactionRequestMock);
    expect(transaction).toEqual({
      transactionStatus: transactionMock.status,
      transactionType: transactionMock.transferTypeId,
      createdAt: transactionMock.createdAt,
      value: transactionMock.value,
    });
  });
});
