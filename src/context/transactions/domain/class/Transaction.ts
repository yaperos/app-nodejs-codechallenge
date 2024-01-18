export default class Transaction {
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly transferTypeId: number;
  readonly value: number;
  transactionExternalId: string;
  status: string;
  createdAt: Date;
  id?: string;
  updatedAt?: Date;
  transactionType?: string;

  constructor(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    transferTypeId: number,
    value: number,
    transactionExternalId: string,
    status: string,
    createdAt: Date,
    id?: string,
    updatedAt?: Date,
    transactionType?: string,
  ) {
    this.accountExternalIdDebit = accountExternalIdDebit
    this.accountExternalIdCredit = accountExternalIdCredit
    this.transferTypeId = transferTypeId
    this.value = value
    this.transactionExternalId = transactionExternalId
    this.status = status
    this.createdAt = createdAt
    if (id) this.id = id;
    if (updatedAt) this.updatedAt = updatedAt;
    if (transactionType) this.transactionType = transactionType;
  }
}
