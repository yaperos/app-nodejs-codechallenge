// import type ITransactionEvent from '../adapters/out/producers/interfaces/transactionEvent.interface'
import { logger } from '../shared/imports'
import { type EventMessageContent } from '../shared/interfaces/eventMessageContent.interface'

export async function eventHandler (event: EventMessageContent<any>): Promise<void> {
  logger.logDebug(`Incoming message event: ${JSON.stringify(event)}`, 'EventHandler.ts')
}
