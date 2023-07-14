import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionValidatedEvent {
  readonly eventName: string;

  constructor(readonly entity: TransactionEntity) {
    this.eventName = 'transaction-validated';
  }

  toString(): string {
    return JSON.stringify(this.entity.toJSON());
  }
}
