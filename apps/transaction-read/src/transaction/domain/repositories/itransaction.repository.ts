import { TransactionStatus } from '../entities/status.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionFilters } from '../filters/transaction-filters';

export interface ITransactionRepository {
  create(transactionRegister: Transaction): Promise<string>;
  updateStatusByExternalId(
    externalId: string,
    newStatus: TransactionStatus,
  ): Promise<string>;
  findByFilters(filters: TransactionFilters): Promise<Transaction[]>;
}
