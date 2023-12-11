export class Transaction {
  constructor(
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly tranferTypeId: number,
    readonly value: number,
  ) {}

  static create(params: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
  }): Transaction {
    return new Transaction(
      params.accountExternalIdDebit,
      params.accountExternalIdCredit,
      params.tranferTypeId,
      params.value,
    );
  }
}
