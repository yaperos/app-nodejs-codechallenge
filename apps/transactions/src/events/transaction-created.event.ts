export class TransactionCreatedEvent {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: number,
    public readonly value: number,
  ) {}

  toString() {
    return JSON.stringify({
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      transferTypeId: this.transferTypeId,
      value: this.value,
    });
  }
}
