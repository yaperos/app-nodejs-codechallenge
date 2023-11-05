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
