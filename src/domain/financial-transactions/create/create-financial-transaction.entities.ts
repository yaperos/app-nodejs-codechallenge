import { StatusType } from 'src/domain/_shared/constants/transactions-status.enum';
import { Type } from 'src/domain/_shared/constants/transaction-type.enum';
import { FinancialTransaction } from 'src/domain/_shared/types/financial-transaction.type';

export type CreateTransactionRequest = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transactionType: string;
};

export type CreateTransactionData = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
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

export type TransactionType = {
  name: string;
};

export type TransactionStatus = {
  name: string;
};

export type CreateTransactionResponse = {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: string;
  transactionId: number;
};
