export enum TransferStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IVerifyTransactionRequest {
  externalId: string;
  amount: number;
}
