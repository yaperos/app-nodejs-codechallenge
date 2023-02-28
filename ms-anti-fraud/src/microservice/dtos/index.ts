export class TransactionMessage {
  transactionExternalId: string;
  value: number;
}

export enum TransactionStatusEnum {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}
