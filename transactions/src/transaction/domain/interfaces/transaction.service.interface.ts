import { Transaction } from '../entities/transaction.type';

export interface TransactionServiceInterface {
  create(transaction: Transaction): Promise<Transaction>;
  reject(id: number): Promise<Transaction>;
  approve(id: number): Promise<Transaction>;
}
