import { TransactionStatusEnum } from '../../app/entities/enums/transactionStatus.enum'
import type TransactionEntity from '../../app/entities/transaction.entity'
import type TransactionEventMessageRepository from '../../app/repositories/out/transactionMessageEvent.repository'
import type ITransactionService from '../../app/services/transaction.service'

export default class TransactionsImplementationService implements ITransactionService {
  private readonly _transactionEventMessageRepository: TransactionEventMessageRepository

  constructor (transactionEventMessageRepository: TransactionEventMessageRepository) {
    this._transactionEventMessageRepository = transactionEventMessageRepository
  }

  async validate (entity: TransactionEntity): Promise<void> {
    const isAmountGreaterThanOther: boolean = entity.value > 1000
    const notificationEntity = isAmountGreaterThanOther ? entity.withStatus(TransactionStatusEnum.REJECTED) : entity.withStatus(TransactionStatusEnum.APPROVED)
    await this._transactionEventMessageRepository.notify(notificationEntity)
  }
}
