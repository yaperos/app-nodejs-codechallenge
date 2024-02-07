export interface TransactionValidateEvent {
  id: string;
  rejected: boolean;
}

export interface TransactionValidateEventProducer {
  handle(input: TransactionValidateEvent): Promise<boolean>;
}
