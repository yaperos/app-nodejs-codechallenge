export class CreateTransactionEvent {
  constructor(
    public readonly id: number,
    public readonly transactionExternalId: string,
    public readonly transactionStatus: string,
    public readonly amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      transactionExternalId: this.transactionExternalId,
      transactionStatus: this.transactionStatus,
      amount: this.amount,
    });
  }
}
