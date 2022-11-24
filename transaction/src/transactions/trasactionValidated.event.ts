import { StatusObjectI } from "./interfaces/status.interface";

export class TransactionValidatedEvent {
  constructor(
    public readonly id: Number,
    public readonly accountExternalIdDebit: String,
    public readonly accountExternalIdCredit: String,
    public readonly tranferTypeId: Number,
    public readonly value: Number,
    public readonly statusArray: StatusObjectI,
    public readonly createdAt: Date,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      statusArray: this.statusArray,
      createdAt: this.createdAt,
    });
  }
}
