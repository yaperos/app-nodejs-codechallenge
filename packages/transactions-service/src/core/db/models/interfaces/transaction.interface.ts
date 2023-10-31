import type TransactionEntity from '../../../../app/entities/transaction.entity'
import type TransactionModel from '../typeorm/transactionModel.model'

export default interface TransactionInterface {
  id?: number
  transaction_external_id?: string
  value?: number
  transaction_type?: string
  transaction_status?: string
  created_at?: Date
  updated_at?: Date
  toDomain?: () => TransactionEntity
  fromDomain?: (entity: TransactionEntity) => TransactionModel
}
