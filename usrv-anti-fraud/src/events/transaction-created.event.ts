export class TransactionCreatedEvent {
    constructor(
      public readonly transactionExternalId: string,
      public readonly amount: number,
    ) {}
  }