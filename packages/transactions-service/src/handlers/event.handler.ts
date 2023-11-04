import type ITransactionEvent from '../adapters/out/producers/interfaces/transactionEvent.interface'
import TransactionConsumerAdapter from '../adapters/in/consumers/transaction.consumer'
import { logger } from '../shared/imports'
// import { type EventMessageContent } from '../shared/interfaces/eventMessageContent.interface'
const adapter = new TransactionConsumerAdapter()
export async function eventHandler (event: any): Promise<void> {
  logger.logDebug(`Incoming message event: ${JSON.stringify(event)}`, 'EventHandler.ts')
  await adapter.update(event.content as unknown as ITransactionEvent)
}
