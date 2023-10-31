export type CreatedTransactionEventPayload = {
  id: string;
  value: number;
};

export interface EventEmitter {
  sendCreatedTransactionEvent(
    payload: CreatedTransactionEventPayload,
  ): Promise<void>;
}
