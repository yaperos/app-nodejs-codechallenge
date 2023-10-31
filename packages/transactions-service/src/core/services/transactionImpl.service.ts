import type TransactionOutDbAdapter from '../../adapters/out/db/transactionOutDb.adapter'
import { TransactionStatusEnum } from '../../app/entities/enums/transactionStatus.enum'
import type TransactionEntity from '../../app/entities/transaction.entity'
import BadRequestException from '../../app/errors/exceptions/badRequest.exception'
import ResourceNotFoundException from '../../app/errors/exceptions/resourceNotFound.exception'
import type TransactionEventMessageRepository from '../../app/repositories/out/transactionMessageEvent.repository'
import type TransactionPersistenceRepository from '../../app/repositories/out/transactionPersistence.repository'
import type ITransactionsService from '../../app/services/transactions.service'
import ErrorMessagesConstants from '../../shared/constants/errorMessages.constants'
import { logger } from '../../shared/imports'

export default class TransactionsImplementationService implements ITransactionsService {
  private readonly _location: string = 'TransactionsImplementationService.ts'
  private readonly _transactionsEventMessageRepository: TransactionEventMessageRepository
  private readonly _transactionsPersistenceRepository: TransactionPersistenceRepository

  constructor (
    transactionsPersistenceRepository: TransactionOutDbAdapter,
    transactionsEventMessageRepository: TransactionEventMessageRepository
  ) {
    this._transactionsPersistenceRepository = transactionsPersistenceRepository
    this._transactionsEventMessageRepository = transactionsEventMessageRepository
  }

  async save (t: TransactionEntity): Promise<TransactionEntity> {
    const existentTransaction = await this._transactionsPersistenceRepository.findOneByExternalId(t.transactionExternalId)
    if (existentTransaction !== null) {
      const message: string = ErrorMessagesConstants.TRANSACTIONS.INTEGRITY.EXISTING
      logger.logError(message, this._location)
      throw new BadRequestException(message)
    }
    const entity = t.withStatus(TransactionStatusEnum.PENDING)
    const result = await this._transactionsPersistenceRepository.save(entity)
    await this._transactionsEventMessageRepository.notify(result)
    return result
  }

  async findAll (): Promise<TransactionEntity[]> {
    return await this._transactionsPersistenceRepository.findAll()
  }

  async findByExternalId (externalId: string): Promise<TransactionEntity> {
    const result = await this._transactionsPersistenceRepository.findOneByExternalId(externalId)
    if (result === null) {
      throw new ResourceNotFoundException(ErrorMessagesConstants.TRANSACTIONS.NOT_FOUND.BY_EXTERNAL_ID)
    }
    return result
  }
}
