import type ITransactionEvent from '../adapters/in/consumers/interfaces/transactionEventModel'
import TransactionConsumerAdapter from '../adapters/in/consumers/transaction.consumer'
import TransactionsKafkaProducerAdapter from '../adapters/out/producers/transactionsKafka.producer'
import type TransactionEventMessageRepository from '../app/repositories/out/transactionMessageEvent.repository'
import type ITransactionService from '../app/services/transaction.service'
import TransactionsImplementationService from '../core/services/transactionServiceImpl.service'
import { logger } from '../shared/imports'
import { type EventMessageContent } from '../shared/interfaces/eventMessageContent.interface'

const transactionEventMessageRepository: TransactionEventMessageRepository = new TransactionsKafkaProducerAdapter()
const transactionsService: ITransactionService = new TransactionsImplementationService(transactionEventMessageRepository)
const adapter: TransactionConsumerAdapter = new TransactionConsumerAdapter(transactionsService)
export async function eventHandler (event: EventMessageContent<any>): Promise<void> {
  logger.logDebug(`Incoming message event: ${JSON.stringify(event)}`, 'EventHandler.ts')
  await adapter.validateTransaction(event.content as unknown as ITransactionEvent)
}
