import { TransactionsPaginator } from 'src/modules/transaction/application/use-cases/transactions-paginator.use-case';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { Transactions } from 'src/modules/transaction/domain/transactions';

import { IntegerMother } from '../../shared/domain/mothers';
import { MockTransactionRepository } from '../domain/mock-transaction.repository';
import { TransactionMother } from '../domain/mothers/transaction.mother';

describe('TransactionPaginator UseCase', () => {
  const transactionRepository = new MockTransactionRepository();
  const transactionsPaginator = new TransactionsPaginator(
    transactionRepository,
  );

  it('should return the transactions', async () => {
    const transactions = new Transactions([
      TransactionMother.random(),
      TransactionMother.random(),
      TransactionMother.random(),
    ]);
    transactionRepository.returnOnFindTransactionsBy(transactions);

    const total = IntegerMother.random();
    transactionRepository.returnOnCountTransactions(total);

    const criteria = TransactionCriteria.createEmpty();
    const response = await transactionsPaginator.run(criteria);
    expect(response.getTransactions()).toEqual(transactions);
    expect(response.getTotal()).toEqual(total);

    transactionRepository.assertFindTransactionsByHasBeenCalledWith(criteria);
    transactionRepository.assertCountTransactionsHasBeenCalledWith(criteria);
  });
});
