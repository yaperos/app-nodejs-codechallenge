import { FinancialTransactionType } from '@/transactions/interfaces/financial-transaction-type.interface';
import { FinancialTransactionStatus } from '@/transactions/interfaces/financial-transaction-status.interface';

export interface FinancialTransaction {
  transactionExternalId: string;
  transactionType: FinancialTransactionType;
  transactionStatus: FinancialTransactionStatus;
  value: number;
  createdAt: Date;
}
