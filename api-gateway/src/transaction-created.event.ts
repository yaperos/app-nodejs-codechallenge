export class TransactionCreatedEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly transactionType: string,
    public readonly transactionStatus: number,
    public readonly value: number,
    public readonly createdAt: Date,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      transactionType: this.transactionType,
      transactionStatus: this.transactionStatus,
      value: this.value,
      createdAt: this.createdAt,
    });
  }
}
