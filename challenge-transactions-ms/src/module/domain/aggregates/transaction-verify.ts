export class TransactionVerify {
  constructor(
    public readonly transactionExternalId: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transactionType: TransactionVerifyType,
    public readonly value: number,
    public readonly transactionStatus: TransactionVerifyStatus,
    public readonly createdAt: Date,
    public readonly updatedAtStatus: Date,
  ) {}
}

export class TransactionVerifyType {
  constructor(public readonly id: number, public readonly name: string) {}
}

export class TransactionVerifyStatus {
  constructor(public readonly id: number, public readonly name: string) {}
}
