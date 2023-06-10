import { FinancialTransaction } from './financial-transaction';
import { FinancialTransactionId } from './financial-transaction-id';
import { FinancialTransactionStatus } from './financial-transaction-status';

export interface FinancialTransactionsRepository {
  save(financialTransaction: FinancialTransaction): Promise<void>;
  findOne(id: FinancialTransactionId): Promise<FinancialTransaction>;
  updateStatus(
    id: FinancialTransactionId,
    financialTransactionStatus: FinancialTransactionStatus,
  ): Promise<number>;
}
