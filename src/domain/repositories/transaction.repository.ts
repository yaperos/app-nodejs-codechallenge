import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByExternalId(externalId: string): Promise<Transaction | null>;
  findByIdempotencyKey(key: string): Promise<Transaction | null>;
  findByAccountId(accountId: string, limit?: number, offset?: number): Promise<Transaction[]>;
  findByStatus(status: string, limit?: number): Promise<Transaction[]>;
  findFailedTransactionsForRetry(limit: number): Promise<Transaction[]>;
  update(transaction: Transaction): Promise<Transaction>;
  countByStatus(status: string, startDate?: Date, endDate?: Date): Promise<number>;
  getTotalAmountByStatus(status: string, startDate?: Date, endDate?: Date): Promise<number>;
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}