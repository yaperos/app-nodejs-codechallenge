export class TransactionProcessedEvent {
  constructor(public readonly id: string, public readonly status: string) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
    });
  }
}
