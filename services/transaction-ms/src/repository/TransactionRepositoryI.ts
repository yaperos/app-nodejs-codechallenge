import { Transaction } from "../domain/Transaction";

export interface TransactionRepositoryI {
  findTransactionById(transaction: Transaction): Promise<Transaction>;
  createTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransaction(transaction: Transaction): Promise<Transaction>;
}
