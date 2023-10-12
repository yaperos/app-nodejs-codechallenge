export class TransactionProcessedEvent {
  constructor(
    public readonly id: string,
    public readonly is_approved: boolean,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      is_approved: this.is_approved,
    });
  }
}
