import { v4 as uuid } from 'uuid'
import type TransactionEntity from '../../../app/entities/transaction.entity'
import type TransactionEventMessageRepository from '../../../app/repositories/out/transactionMessageEvent.repository'
import { type MessageManager } from '../../../core/messages/messageManager'
import { transactionMessageManagerInstance } from '../../../globals'
import { type EventMessage } from '../../../shared/interfaces/eventMessage.interface'
import { EventNames } from '../../../shared/imports'
import type ITransactionEvent from './interfaces/transactionEvent.interface'

export default class TransactionsKafkaProducerAdapter implements TransactionEventMessageRepository {
  private readonly _messageManager: MessageManager = transactionMessageManagerInstance
  public async notify (transaction: TransactionEntity): Promise<void> {
    const { transactionExternalId, value, transactionStatus } = transaction
    const message: EventMessage<ITransactionEvent> = {
      key: uuid(),
      value: {
        name: EventNames.TRANSACTION_CREATED,
        content: {
          transaction_external_id: transactionExternalId,
          transaction_status: transactionStatus?.toString(),
          value
        }
      }
    }
    await this._messageManager.produce<ITransactionEvent>(message)
  }
}
