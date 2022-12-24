import { TransactionEntity } from './transaction.entity'

export class TransactionFactory implements TransactionEntity {
  accountExternalIdDebit: string
  accountExternalIdCredit: string
  tranferTypeId: number
  value: number

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
