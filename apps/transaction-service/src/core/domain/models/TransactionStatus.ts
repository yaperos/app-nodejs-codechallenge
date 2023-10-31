export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const TransactionStatusValues: string[] =
  Object.values(TransactionStatus);
