import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
  findById(transactionExternalId: string): Promise<TransactionEntity | null>;
  updateStatus(
    transactionExternalId: string,
    status: string
  ): Promise<TransactionEntity>;
}
