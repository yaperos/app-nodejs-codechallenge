import { StatusType } from 'src/domain/_shared/constants/transactions-status.enum';
import { Type } from 'src/domain/_shared/constants/transaction-type.enum';
import { FinancialTransaction } from 'src/domain/_shared/types/financial-transaction.type';

export type CreateTransactionRequest = {
  value: number;
  transactionType: string;
};

export type CreateTransactionData = {
  value: number;
  transactionStatus: TransactionStatusId;
  transactionType: TransactionTypeId;
};

export type TransactionStatusId = {
  id: number;
};

export type TransactionTypeId = {
  id: number;
};

export { FinancialTransaction };

export { StatusType };

export { Type };

export type CreateTransactionResponse = {
  description: string;
  status: string;
  transactionId: number;
};
