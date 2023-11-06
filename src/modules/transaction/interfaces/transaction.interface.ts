import { StatusTransactions } from '../enums/status.enum';

export interface ITransactionPayload {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusTransactions;
}

export interface ITransactionResponse {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: string;
}

export interface ITransactionById {
  transactionExternalId: string;
  transactionType: Transaction;
  transactionStatus: Transaction;
  value: number;
  createdAt: string;
}

export interface Transaction {
  name: string;
}
