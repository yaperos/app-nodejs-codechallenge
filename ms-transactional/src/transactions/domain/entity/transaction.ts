export enum Channel {
  APP = 'APP',
  BCP = 'BCP',
  PLIN = 'PLIN',
}

export enum TransferType {
  DEFAULT = 'DEFAULT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Transaction {
  transactionId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  channel: Channel;
  transferType: TransferType;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
