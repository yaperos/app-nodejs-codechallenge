import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionRejectedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionRejected
  }

  constructor (readonly data: { id_transaction: string }) {}
}
