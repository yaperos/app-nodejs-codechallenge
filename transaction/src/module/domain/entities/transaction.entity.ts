import { ITransaction } from './transaction.interface'

export class TransactionEntity implements ITransaction {
  readonly accountExternalIdDebit: string
  readonly accountExternalIdCredit: string
  readonly tranferTypeId: number
  readonly value: number

  constructor({
    accountExternalIdCredit,
    accountExternalIdDebit,
    tranferTypeId,
    value,
  }: {
    accountExternalIdDebit: string
    accountExternalIdCredit: string
    tranferTypeId: number
    value: number
  }) {
    this.accountExternalIdDebit = accountExternalIdDebit
    this.accountExternalIdCredit = accountExternalIdCredit
    this.tranferTypeId = tranferTypeId
    this.value = value
  }
}
