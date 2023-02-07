import { Transaction } from '../entities/transaction.entity';
import { EventInterface } from '../../shared/event/EventInterface';

export class TransactionCreatedEvent implements EventInterface {
  attributes = {
    timestamp: new Date(),
    topic: 'transactionCreated',
  };
  constructor(readonly data: Transaction) {}
}
