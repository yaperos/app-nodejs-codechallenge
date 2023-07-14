import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionUpdatedEvent {
  readonly eventName: string;

  constructor(readonly transaction: TransactionEntity) {
    this.eventName = 'transaction-updated';
  }

  toString(): string {
    return JSON.stringify(this.transaction.toJSON());
  }
}
