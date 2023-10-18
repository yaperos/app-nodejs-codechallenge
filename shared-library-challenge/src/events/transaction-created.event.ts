import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionCreatedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionCreated
  }

  constructor (readonly data: { transaction_external_id: string, value: number }) {}
}
