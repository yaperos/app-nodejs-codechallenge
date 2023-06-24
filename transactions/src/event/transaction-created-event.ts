export class TransactionCreatedEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly val: number,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      val: this.val,
    });
  }
}
