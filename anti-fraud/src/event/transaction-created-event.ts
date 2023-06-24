export class TransactionCreatedEvent {
  constructor(
    public readonly transactionExternalId: string,
    public val: number,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      val: this.val,
    });
  }
}
