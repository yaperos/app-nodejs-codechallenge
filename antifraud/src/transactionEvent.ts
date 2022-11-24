export class TransactionEvent {
    constructor(
      public readonly id: number,
      public readonly transactionExternalId: string,
      public readonly transactionStatus: string,
      public readonly value: number,
    ) {}
  }