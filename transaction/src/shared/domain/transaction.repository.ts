import { Transaction } from './transaction.model';

export interface TransactionRepository {
  create(input: Transaction): Promise<void>;
  update(input: Transaction): Promise<void>;
  getById(id: string): Promise<Transaction | null>;
}
