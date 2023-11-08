import {
  TransactionStatus,
  TransactionType as TrxType,
} from 'src/types/transaction.type';

export interface TransactionType {
  1: TrxType;
}

export interface TransactionResponse {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
