export class TransactionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly value: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
      value: this.value,
    });
  }
}
