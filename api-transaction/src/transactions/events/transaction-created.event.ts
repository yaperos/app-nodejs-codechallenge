/* eslint-disable prettier/prettier */
export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: number,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly amount: string,
    public readonly status: string,
    public readonly createdAt: string,
  ) {}

  toString() {
    return JSON.stringify({
      transactionId: this.transactionId,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
    });
  }
}
