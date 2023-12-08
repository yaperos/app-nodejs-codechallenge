import { Event } from '../contracts/Event';

export class TransactionCreatedEvent implements Event {
  name: string;
  message: any;

  constructor(transaction: any) {
    this.name = 'transaction-created';
    this.message = transaction;
  }
}

export class TransactionUpdatedEvent implements Event {
  name: string;
  message: any;

  constructor(transaction: any) {
    this.name = 'transaction-updated';
    this.message = transaction;
  }
}
