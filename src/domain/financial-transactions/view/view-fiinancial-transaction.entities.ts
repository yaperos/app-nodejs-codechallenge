import { FinancialTransaction } from 'src/domain/_shared/types/financial-transaction.type';

export type FinancialTransactionFilters = {
  id?: number;
  transactionExternalId?: string;
};

export type { FinancialTransaction };

export type TransactionType = {
  name: string;
};

export type TransactionStatus = {
  name: string;
};

export type FinancialTransactionResponse = {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: string;
  transactionId: number;
};
