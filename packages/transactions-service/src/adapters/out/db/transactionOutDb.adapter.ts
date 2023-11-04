import { type DataSource } from 'typeorm'
import type TransactionEntity from '../../../app/entities/transaction.entity'
import type TransactionPersistenceRepository from '../../../app/repositories/out/transactionPersistence.repository'
import { type Database } from '../../../core/db/database'
import TransactionModel from '../../../core/db/models/typeorm/transactionModel.model'
import { logger } from '../../../shared/imports'

export default class TransactionOutDbAdapter implements TransactionPersistenceRepository {
  private readonly _location: string = 'TransactionOutDbAdapter.ts'
  private readonly _repository

  constructor (databaseInstance: Database<DataSource>) {
    this._repository = databaseInstance.getDataSource().getRepository(TransactionModel)
  }

  async findOneByExternalId (externalId: string): Promise<TransactionEntity | null> {
    try {
      logger.logDebug(`Looking for transaction with id: ${externalId}`, this._location)
      const result = await this._repository.findOneBy({ transaction_external_id: externalId })
      logger.logDebug(`Transaction found: ${JSON.stringify(result)}`, this._location)
      if (result == null) return null
      return result.toDomain()
    } catch (error: any) {
      logger.logError(error, this._location)
      throw error
    }
  }

  async save (t: TransactionEntity): Promise<TransactionEntity> {
    try {
      logger.logDebug(`Saving transaction record: ${JSON.stringify(t)}`, this._location)
      const result = await this._repository.save(TransactionModel.fromDomain(t))
      logger.logDebug(`Record saved: ${JSON.stringify(result)}`, this._location)
      return t.withCreatedAt(result.created_at)
    } catch (error: any) {
      logger.logError(error, this._location)
      throw error
    }
  }

  async findAll (): Promise<TransactionEntity[]> {
    try {
      const result = await this._repository.find()
      logger.logDebug(`Records found: ${JSON.stringify(result)}`, this._location)
      return result.map(t => t.toDomain())
    } catch (error: any) {
      logger.logError(error, this._location)
      throw error
    }
  }

  async updateTransactionStatus (entity: TransactionEntity): Promise<TransactionEntity> {
    try {
      const { transactionExternalId, transactionStatus } = entity
      logger.logDebug(`Updating transaction identified by externalTransactionId: ${transactionExternalId}`, this._location)
      logger.logDebug(`Transaction: ${transactionExternalId} new status ${transactionStatus}`)
      const result = await this._repository
        .createQueryBuilder()
        .update()
        .set({ transaction_status: transactionStatus })
        .where('transaction_external_id = :transactionExternalId', { transactionExternalId })
        .returning('updated_at')
        .execute()
      logger.logDebug('Transaction record updated', this._location)
      return entity.withUpdatedAt(result.raw[0].updated_at)
    } catch (error) {
      logger.logError(error, this._location)
      throw error
    }
  }
}
