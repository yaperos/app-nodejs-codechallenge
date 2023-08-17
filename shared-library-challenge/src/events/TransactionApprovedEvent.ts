import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionApprovedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionApproved
  }

  constructor (readonly data: { id_transaction: string }) {}
}
