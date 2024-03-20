export interface ITransaction {
  amount: number;
  externalId: string;
  accountExternalName: string;
  transferTypeName: TransferType;
  status: TransferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransferType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
}

export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ISaveTransactionRequest {
  amount: number;
  accountExternalName: string;
  transferTypeName: TransferType;
}

export interface ISaveTransactionResponse {
  externalId: string;
  amount: number;
  status: TransferStatus;
  createdAt: Date;
}

export interface IUpdateStatusTransactionRequest {
  externalId: string;
  status: TransferStatus;
}

export interface IFindTransactionResponse {
  externalId: string;
  amount: number;
  transferTypeName: TransferType;
  status: TransferStatus;
  createdAt: Date;
}
