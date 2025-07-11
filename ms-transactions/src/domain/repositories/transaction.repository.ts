import { RepositoryTransactionContext } from './transaction-context';
import { Transaction } from '../entities/transaction';
import { TransactionStatus } from '../enums/transaction.enums';

export interface TransactionRepository {
  create(
    transaction: Transaction,
    context?: RepositoryTransactionContext,
  ): Promise<Transaction>;

  findById(
    id: string,
    context?: RepositoryTransactionContext,
  ): Promise<Transaction | null>;

  updateStatus(
    id: string,
    status: TransactionStatus,
    context?: RepositoryTransactionContext,
  ): Promise<void>;
}
