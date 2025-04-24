export class Transaction {
    constructor(
      public readonly id: string,
      public readonly accountExternalIdDebit: string,
      public readonly accountExternalIdCredit: string,
      public readonly transferTypeId: number,
      public readonly value: number,
      public readonly transactionStatusId: number,
      public readonly createdAt: Date,
    ) {}
  }
  