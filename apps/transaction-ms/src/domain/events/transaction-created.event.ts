import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionCreatedEvent {
  readonly eventName: string;

  constructor(readonly transaction: TransactionEntity) {
    this.eventName = 'transaction-created';
  }

  toString(): string {
    return JSON.stringify(this.transaction.toJSON());
  }
}
