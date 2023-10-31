import type TransactionEntity from '../../../../../app/entities/transaction.entity'
import dateFormatterUtil from '../../../../../shared/utils/dateFormatter.util'
import type CommonPropertyObject from './commonPropertyObject.interface'

class TransactionResponseModel {
  transactionExternalId: string
  transactionType: CommonPropertyObject
  transactionStatus?: CommonPropertyObject
  value: number
  createdAt?: string

  constructor (entity: TransactionEntity) {
    const { transactionExternalId, transactionStatus, transactionType, value, createdAt } = entity
    this.transactionExternalId = transactionExternalId
    this.transactionStatus = { name: transactionStatus?.toString() }
    this.transactionType = { name: transactionType.toString() }
    this.value = value
    this.createdAt = dateFormatterUtil(createdAt)
  }
}

export default TransactionResponseModel
