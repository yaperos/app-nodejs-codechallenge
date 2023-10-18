import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionRejectedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionRejected
  }

  constructor (readonly data: { transaction_external_id: string }) {}
}
