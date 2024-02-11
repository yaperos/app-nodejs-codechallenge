export class Transaction {
  private accountExternalIdDebit: string;
  private accountExternalIdCredit: string;
  private tranferTypeId: number;
  private value: number;

  constructor(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ) {
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.tranferTypeId = tranferTypeId;
    this.value = value;
  }

  static create(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ): Transaction {
    const transaction = new Transaction(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    return transaction;
  }

  static fromPrimitives(plainData: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
  }): Transaction {
    return new Transaction(
      plainData.accountExternalIdDebit,
      plainData.accountExternalIdCredit,
      plainData.tranferTypeId,
      plainData.value,
    );
  }

  toPrimitives() {
    return {
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
    };
  }
}
