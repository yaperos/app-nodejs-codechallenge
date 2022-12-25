import { Transaction } from '@prisma/client'
import { getTransactionTypeName } from '../../infrastructure/interface/dtos/enums/transaction.enum'
import { ITransactionResponse, ITransactionStatus, ITransactionType } from './transaction-info.interface'

export class TransactionInfoEntity implements ITransactionResponse {
  readonly transactionExternalId: string
  readonly transactionType: ITransactionType
  readonly transactionStatus: ITransactionStatus
  readonly value: number
  readonly createdAt: Date
  constructor(transaction: Transaction) {
    this.transactionExternalId = transaction.transactionExternalId
    this.createdAt = transaction.createdAt
    this.value = transaction.value
    this.transactionStatus = { name: transaction.transactionStatus }
    this.transactionType = { name: getTransactionTypeName(transaction.tranferTypeId) }
  }
}
