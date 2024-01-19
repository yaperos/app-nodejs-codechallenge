import { TransactionFinder } from 'src/modules/transaction/application/use-cases/transaction-finder.use-case';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { TransactionNotFoundError } from 'src/modules/transaction/domain/transaction-not-found.error';

import { MockTransactionRepository } from '../domain/mock-transaction.repository';
import { TransactionMother } from '../domain/mothers/transaction.mother';

describe('TransactionFinder UseCase', () => {
  const transactionRepository = new MockTransactionRepository();
  const transactionFinder = new TransactionFinder(transactionRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the transaction', async () => {
    const transaction = TransactionMother.random();
    transactionRepository.returnOnFindOneTransactionBy(transaction);

    const criteria = TransactionCriteria.createEmpty();
    const response = await transactionFinder.run(criteria);

    expect(response).toEqual(transaction);
    transactionRepository.assertFindOneTransactionByHasBeenCalledWith(criteria);
  });

  it('should throw a not found error', async () => {
    transactionRepository.returnOnFindOneTransactionBy(null);

    const criteria = TransactionCriteria.createEmpty();
    await expect(transactionFinder.run(criteria)).rejects.toThrow(
      TransactionNotFoundError,
    );
    transactionRepository.assertFindOneTransactionByHasBeenCalledWith(criteria);
  });
});
