import type { TransactionStatusEnum } from './enums/transactionStatus.enum'
import type { TransactionTypeEnum } from './enums/transactionType.enum'

export default class TransactionEntity {
  private readonly _transactionExternalId: string
  private readonly _value: number
  private readonly _transactionType: TransactionTypeEnum
  private readonly _transactionStatus?: TransactionStatusEnum
  private readonly _createdAt?: Date
  private readonly _updatedAt?: Date

  constructor (
    transactionExternalId: string,
    value: number,
    transactionType: TransactionTypeEnum,
    transactionStatus?: TransactionStatusEnum,
    createdAt?: Date,
    updatedAt?: Date) {
    this._transactionExternalId = transactionExternalId
    this._value = value
    this._transactionType = transactionType
    this._transactionStatus = transactionStatus
    this._createdAt = createdAt
    this._updatedAt = updatedAt
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

  get transactionType (): TransactionTypeEnum {
    return this._transactionType
  }

  get createdAt (): Date | undefined {
    return this._createdAt
  }

  get updatedAt (): Date | undefined {
    return this._updatedAt
  }

  public withCreatedAt (date?: Date): TransactionEntity {
    return new TransactionEntity(
      this._transactionExternalId,
      this._value,
      this._transactionType,
      this._transactionStatus,
      date,
      this._updatedAt)
  }

  public withUpdatedAt (date: Date): TransactionEntity {
    return new TransactionEntity(
      this._transactionExternalId,
      this._value,
      this._transactionType,
      this._transactionStatus,
      this._createdAt,
      date)
  }

  public withStatus (status: TransactionStatusEnum): TransactionEntity {
    return new TransactionEntity(
      this._transactionExternalId,
      this._value,
      this._transactionType,
      status,
      this._createdAt)
  }
}
