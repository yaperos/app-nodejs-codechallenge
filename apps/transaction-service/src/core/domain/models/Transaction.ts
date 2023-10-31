import { TransactionType } from './TransactionType';

export type Transaction = {
  id: string;
  externalId: string;
  value: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: TransactionType;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionTypeOutput = {
  name: string;
};

export type TransactionStatusOutput = {
  name: string;
};

export type TransactionOutput = {
  transactionExternalId: string;
  transactionType: TransactionTypeOutput;
  transactionStatus: TransactionStatusOutput;
  value: number;
  createdAt: Date;
};
