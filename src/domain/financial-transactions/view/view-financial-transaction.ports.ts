import { FinancialTransaction, FinancialTransactionFilters } from './view-fiinancial-transaction.entities';

export abstract class FinancialTransactionPort {
  abstract getByFilter(filters: FinancialTransactionFilters): Promise<FinancialTransaction>;
}
