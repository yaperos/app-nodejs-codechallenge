import { Transaction } from '../entities/transaction';
import { IDomainEvent } from '../interfaces/domain-event';

export class TransactionCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public transaction: Transaction;

  constructor(transaction: Transaction) {
    this.dateTimeOccurred = new Date();
    this.transaction = transaction;
  }

  getId(): string {
    return this.transaction.id.toString();
  }
}
