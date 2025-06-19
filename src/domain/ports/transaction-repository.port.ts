import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionRepositoryPort {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
  findByExternalId(transactionExternalId: string): Promise<TransactionEntity | null>;
  updateStatus(transactionExternalId: string, status: string): Promise<void>;
} 