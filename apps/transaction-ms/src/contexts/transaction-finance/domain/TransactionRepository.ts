import { TransactionModel } from './models/transaction.model';
import { Transaction } from './Transaction';

export interface TransactionRepository {
  find(transactionId: string): Promise<Partial<TransactionModel | null>>;
  create(transaction: Transaction): Promise<Partial<TransactionModel>>;
  update(
    transactionId: string,
    transactionStatus: string,
  ): Promise<Partial<TransactionModel>>;
}
