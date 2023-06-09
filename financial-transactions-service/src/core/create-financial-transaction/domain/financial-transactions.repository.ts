import { FinancialTransaction } from './financial-transaction';
import { FinancialTransactionId } from './financial-transaction-id';

export interface FinancialTransactionsRepository {
  save(financialTransaction: FinancialTransaction): Promise<void>;
  findOne(id: FinancialTransactionId): Promise<FinancialTransaction>;
}
