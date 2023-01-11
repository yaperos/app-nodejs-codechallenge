export class CreateTransactionEvent {
  constructor(
    private readonly accountExternalIdDebit: string,
    private readonly accountExternalIdCredit: string,
    private readonly tranferTypeId: number,
    private readonly value: number,
  ) {}

  toString() {
    return JSON.stringify({
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
    });
  }
}
