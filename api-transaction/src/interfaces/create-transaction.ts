export interface IRequestTransactionCreate {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}
export interface ITransactionType {
  name: string;
}

export interface ITransactionStatus {
  name: string;
}
export interface IResponseTransactionCreate {
  transactionExternalId: string;
  transactionType: ITransactionType;
  transactionStatus: ITransactionStatus;
  value: number;
  createdAt: Date;
}
