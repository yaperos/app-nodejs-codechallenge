import { EventInterface } from '../../shared/event/EventInterface';

export class TransactionApprovedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: 'transactionApproved',
  };

  constructor(readonly data: { id_transaction: string }) {}
}
