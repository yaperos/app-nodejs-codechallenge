import { EventInterface } from '../../shared/event/EventInterface';

export class TransactionRejectedEvent<T> implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: 'transactionRejected',
  };
  constructor(readonly data: { id_transaction: string }) {}
}
