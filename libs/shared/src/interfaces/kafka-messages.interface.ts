export interface TransactionCreatedEvent {
  transactionId: string;
  value: number;
}

export interface TransactionStatusEvent {
  transactionId: string;
  statusCode: string;
  reason: string;
}
