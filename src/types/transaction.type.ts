export interface ITransaction {
  _id: string;
  transactionId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionStatus: TransactionStatus;
  tranferTypeId: number;
  value: number;
  createdAt: string;
}

export enum TransactionStatus {
  PENDING,
  APPROVED,
  REJECTED
}