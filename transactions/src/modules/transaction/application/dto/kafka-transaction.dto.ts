export interface KafkaTransactionStatusMessage {
  id: string;
}

export interface KafkaTransactionCreatedMessage {
  id: string;
  value: number;
}
