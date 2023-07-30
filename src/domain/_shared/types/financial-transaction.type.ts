import { TransactionStatus } from './transaction-status.type';
import { TransactionType } from './transaction-type.type';

export interface FinancialTransaction extends FinancialTransactionData {
  id: number;
  status: TransactionStatus;
  transactionType: TransactionType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type FinancialTransactionData = {
  value: number;
};
