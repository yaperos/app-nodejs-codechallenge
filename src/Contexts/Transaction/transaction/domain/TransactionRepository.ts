import { Transaction } from './Transaction';

export interface TransactionRepository {
  findOne(query: Record<string, any>): Promise<Transaction>;
  create(data: Transaction): Promise<void>;
  save(commerce: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction>;
}
