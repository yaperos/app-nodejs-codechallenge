export interface ITransaction {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transactionType: ITransactionType;
  transactionStatus: ITransactionStatus;
  createdAt: string;
  updatedAtStatus: string;
}

export interface ITransactionType {
  id: number;
  name: string;
}
export interface ITransactionStatus {
  id: number;
  name: string;
}

export interface ITransactionBody {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: string;
}
