export class TransactionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
      amount: this.amount,
    });
  }
}
