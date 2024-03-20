export class TransactionEvent {
  constructor(
    public readonly amount: number,
    public readonly externalId: string,
  ) {}

  toString() {
    return JSON.stringify({
      amount: this.amount,
      externalId: this.externalId,
    });
  }
}
