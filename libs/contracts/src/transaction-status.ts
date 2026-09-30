export enum TransactionStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type FinalTransactionStatus =
  TransactionStatus.Approved | TransactionStatus.Rejected;
