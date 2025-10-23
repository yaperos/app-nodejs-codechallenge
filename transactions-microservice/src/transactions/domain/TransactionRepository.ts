import { Transaction, TransactionPrimitives } from 'src/transactions/domain/Transaction';
import { TransactionId } from 'src/transactions/domain/TransactionId';
import { TransactionStatus } from 'src/transactions/domain/TransactionStatus';

export interface TransactionRepository {
  createTransaction(transaction: Transaction): Promise<TransactionPrimitives>;
  updateTransactionStatus(id: TransactionId, status: TransactionStatus): Promise<TransactionPrimitives>;
  getTransaction(id: TransactionId): Promise<TransactionPrimitives>;
}
