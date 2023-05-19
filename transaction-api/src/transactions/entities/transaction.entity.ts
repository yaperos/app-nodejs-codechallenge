export class TransactionFull {
  constructor(
    public transactionExternalId: string,
    public accountExternalIdDebit: string,
    public accountExternalIdCredit: string,
    public transferTypeId: string,
    public value: number,
    public status: string,
    public createdAt: Date,
  ) {}
}

export class Transaction {
  constructor(
    public transactionExternalId: string,
    public transactionType: TransactionType,
    public transactionStatus: TransactionStatus,
    public value: number,
    public createdAt: Date,
  ) {}
}

export class TransactionType {
  constructor(public name: string) {}
}

export class TransactionStatus {
  constructor(public name: string) {}
}
