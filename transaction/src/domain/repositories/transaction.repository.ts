import { Transaction } from '../aggregates/transaction';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(transactionExternalId: string): Promise<Transaction>;
}
