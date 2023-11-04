import { TransactionStatusEnum } from '../../app/entities/enums/transactionStatus.enum'
import type TransactionEntity from '../../app/entities/transaction.entity'
import type TransactionEventMessageRepository from '../../app/repositories/out/transactionMessageEvent.repository'
import type ITransactionService from '../../app/services/transaction.service'
import { logger } from '../../shared/imports'

export default class TransactionsImplementationService implements ITransactionService {
  private readonly _location: string = 'TransactionsImplementationService.ts'
  private readonly _transactionEventMessageRepository: TransactionEventMessageRepository

  constructor (transactionEventMessageRepository: TransactionEventMessageRepository) {
    this._transactionEventMessageRepository = transactionEventMessageRepository
  }

  async validate (entity: TransactionEntity): Promise<void> {
    const { value, transactionExternalId } = entity
    const { TRANSACTION_MAX_AMOUNT } = process.env
    const maxTransactionAllowedAmount: number = TRANSACTION_MAX_AMOUNT !== undefined ? parseInt(TRANSACTION_MAX_AMOUNT) : 1000
    const transactionRejected: boolean = value > maxTransactionAllowedAmount
    if (transactionRejected) {
      logger.logError(`The transaction identified by:  ${transactionExternalId}  will be rejected`, this._location)
    } else {
      logger.logDebug(`Transaction identified by: ${transactionExternalId}  will be approved`, this._location)
    }
    const notificationEntity = transactionRejected ? entity.withStatus(TransactionStatusEnum.REJECTED) : entity.withStatus(TransactionStatusEnum.APPROVED)
    await this._transactionEventMessageRepository.notify(notificationEntity)
  }
}
