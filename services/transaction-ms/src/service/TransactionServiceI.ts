import { Transaction } from "../domain/Transaction";

export interface TransactionServiceI {
  findTransactionById(transaction: Transaction): Promise<Transaction>;
  createTransaction(transaction: Transaction): Promise<Transaction>;
  processVerifyTransaction(transaction: Transaction): Promise<Transaction>;
}
