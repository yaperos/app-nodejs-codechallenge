import { type EventInterface } from './EventInterface'
import { EventsEnum } from './EventsEnum'

export class TransactionApprovedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: EventsEnum.transactionApproved
  }

  constructor (readonly data: { transaction_external_id: string }) {}
}
