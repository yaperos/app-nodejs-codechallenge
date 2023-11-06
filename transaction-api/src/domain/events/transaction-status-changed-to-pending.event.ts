export class TransactionStatusChangedToPendingEvent {
  constructor(
    public readonly transactionId: string,
    public readonly value: number,
  ) {}
}
