import { type TransactionStatusEnum } from './enums/transactionStatus.enum'

export default class TransactionEntity {
  private readonly _transactionExternalId: string
  private readonly _value: number
  private readonly _transactionStatus?: TransactionStatusEnum

  constructor (transactionExternalId: string, value: number, transactionStatus?: TransactionStatusEnum) {
    this._transactionExternalId = transactionExternalId
    this._value = value
    this._transactionStatus = transactionStatus
  }

  get transactionExternalId (): string {
    return this._transactionExternalId
  }

  get value (): number {
    return this._value
  }

  get transactionStatus (): TransactionStatusEnum | undefined {
    return this._transactionStatus
  }

  public withStatus (status?: TransactionStatusEnum): TransactionEntity {
    return new TransactionEntity(
      this._transactionExternalId,
      this._value,
      status
    )
  }
}
