import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'
import type TransactionInterface from '../interfaces/transaction.interface'
import TransactionEntity from '../../../../app/entities/transaction.entity'
import { getTransactionStatusFromValue } from '../../../../app/entities/enums/transactionStatus.enum'
import { getTransactionTypeEnumFromValue } from '../../../../app/entities/enums/transactionType.enum'

@Entity({ name: 'transactions' })
class TransactionModel extends BaseEntity implements TransactionInterface {
  @PrimaryGeneratedColumn()
    id?: number

  @Column({ name: 'transaction_external_id', unique: true, type: 'text' })
    transaction_external_id: string

  @Column({ name: 'value', type: 'float8' })
    value!: number

  @Column({ name: 'transaction_type', type: 'text' })
    transaction_type: string

  @Column({ name: 'transaction_status', type: 'text' })
    transaction_status?: string

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date

  constructor (externalId: string, value: number, trasactionType: string, transactionStatus?: string, createdAt?: Date, updatedAt?: Date) {
    super()
    this.transaction_external_id = externalId
    this.value = value
    this.transaction_type = trasactionType
    this.transaction_status = transactionStatus
    this.created_at = createdAt
    this.updated_at = updatedAt
  }

  toDomain (): TransactionEntity {
    return new TransactionEntity(
      this.transaction_external_id ?? '',
      this.value,
      getTransactionTypeEnumFromValue(this.transaction_type),
      getTransactionStatusFromValue(this.transaction_status),
      this.created_at,
      this.updated_at
    )
  }

  public static fromDomain (entity: TransactionEntity): TransactionModel {
    return new TransactionModel(
      entity.transactionExternalId,
      entity.value,
      entity.transactionType,
      entity.transactionStatus?.toString(),
      entity.createdAt)
  }
}
export default TransactionModel
