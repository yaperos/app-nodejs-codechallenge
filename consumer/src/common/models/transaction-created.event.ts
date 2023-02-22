export class DataCreated {
    constructor(
      public readonly id: number,
      public readonly transactionExternalId: string,
      public readonly transactionType: number,
      public transactionStatus: number,
      public readonly valueTx: number,
    ) {}
  }