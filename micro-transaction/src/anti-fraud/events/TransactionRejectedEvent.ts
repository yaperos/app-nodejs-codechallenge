import { EventInterface } from '../../shared/event/EventInterface';

export class TransactionRejectedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: 'transactionRejected',
  };

  constructor(readonly data: { id_transaction: number }) {}
}
