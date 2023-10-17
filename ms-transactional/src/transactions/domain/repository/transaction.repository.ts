import { Transaction } from '../entity/transaction';

export interface TransactionRepository {
  createTransaction(transaction: Partial<Transaction>): Promise<Transaction>;
  findTransaction(transactionId: string): Promise<Transaction | null>;
  updateTransaction(
    transactionId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction>;
  findLastTransactionByAccountExternalIdDebit(
    accountExternalIdDebit: string,
  ): Promise<Transaction | null>;
}
