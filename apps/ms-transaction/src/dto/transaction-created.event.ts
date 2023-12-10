export class TransactionCreatedEvent {
  constructor(
    private readonly transactionExternalId: string,
    private readonly value: number,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      value: this.value,
    });
  }
}
