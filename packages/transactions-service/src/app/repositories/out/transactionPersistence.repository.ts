import type TransactionEntity from '../../entities/transaction.entity'
import type PersistenceRepository from './persistence.repository'

export default interface TransactionPersistenceRepository extends PersistenceRepository<TransactionEntity> {
  findOneByExternalId: (externalId: string) => Promise<TransactionEntity | null>
  updateTransactionStatus: (entity: TransactionEntity) => Promise<TransactionEntity>
}
