import Transaction from '../transaction';
import { Optional } from 'typescript-optional';

export interface TransactionRepository {
  getAllTransactions(): Promise<Transaction[]>;

  getTransaction(transactionId: string): Promise<Optional<Transaction>>;

  createTransaction(transaction: Transaction): Promise<Optional<Transaction>>;

  deleteTransaction(transactionId: string): Promise<Optional<Transaction>>;

  updateTransaction(
    transactionId: string,
    transaction: Transaction,
  ): Promise<Optional<Transaction>>;
}
