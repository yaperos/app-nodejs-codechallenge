export class TransactionCreatedEvent {
    constructor(
      public readonly transactionExternalId: string,
      public readonly amount: number,
    ) {}
  
    toString() {
      return JSON.stringify({
        transactionExternalId: this.transactionExternalId,
        amount: this.amount,
      });
    }
  }