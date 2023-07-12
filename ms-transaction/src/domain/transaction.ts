export default class Transaction {
  transactionId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: string;
  createdAt: Date;

  constructor(params: Partial<Transaction>) {
    Object.assign(this, params);
  }

  public getTransactionId(): string {
    return this.transactionId;
  }

  public getValue(): number {
    return this.value;
  }

  public getAccountExternalIdDebit(): string {
    return this.accountExternalIdDebit;
  }

  public getAccountExternalIdCredit(): string {
    return this.accountExternalIdCredit;
  }

  public getTranferTypeId(): number {
    return this.tranferTypeId;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string) {
    this.status = status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
