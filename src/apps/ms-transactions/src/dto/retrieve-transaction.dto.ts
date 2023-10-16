import { Types } from 'mongoose'
import { TransactionDocument } from '../ms-transactions.schema'
import { TransactionStatus } from '../ms-transactions.constants'

class TransactionTypeDto {
  name: number
}

class TransactionStatusDto {
  name: TransactionStatus
}

export class RetrieveTransactionDto {
  transactionExternalId: Types.ObjectId
  transactionType: TransactionTypeDto
  transactionStatus: TransactionStatusDto
  value: number
  createdAt: Date

  constructor(transaction: TransactionDocument) {
    this.transactionExternalId = transaction.transactionExternalId
    this.transactionType = { name: transaction.transferTypeId }
    this.transactionStatus = { name: transaction.status }
    this.value = transaction.value
    this.createdAt = transaction.createdAt
  }
}