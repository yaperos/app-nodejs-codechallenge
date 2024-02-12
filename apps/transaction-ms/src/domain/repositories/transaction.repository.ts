import { Transaction } from '../model/transaction.model';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | undefined>;
}
