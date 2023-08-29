export enum TransactionStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export enum TransferType {
  Debit = '1',
  Credit = '2',
}

export interface TransactionResponse {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;
}
