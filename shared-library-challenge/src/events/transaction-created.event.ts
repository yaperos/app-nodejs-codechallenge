import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionCreatedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionCreated
  }

  constructor (readonly data: { id_transaction: string, value: number }) {}
}
