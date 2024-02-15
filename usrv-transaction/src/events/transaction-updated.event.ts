export class TransactionUpdatedEvent {
    constructor(
      public readonly transactionExternalId: string,
      public readonly status: string,
    ) {}
  
    toString() {
      return JSON.stringify({
        transactionExternalId: this.transactionExternalId,
        status: this.status
      });
    }
  }