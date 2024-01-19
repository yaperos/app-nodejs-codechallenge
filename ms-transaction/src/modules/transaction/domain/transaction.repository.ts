import { Transaction } from './transaction';
import { TransactionCriteria } from './transaction-criteria';
import { Transactions } from './transactions';

export const TRANSACTION_REPOSITORY_ALIAS = Symbol('TransasctionRepository');

export interface TransactionRepository {
  createTransaction(transaction: Transaction): Promise<void>;

  updateTransaction(transaction: Transaction): Promise<void>;

  findOneTransactionBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transaction | null>;

  findTransactionsBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transactions>;

  countTransactions(transactionCriteria: TransactionCriteria): Promise<number>;
}
