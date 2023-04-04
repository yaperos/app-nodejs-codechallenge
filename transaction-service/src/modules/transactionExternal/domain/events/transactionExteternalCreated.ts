import { IDomainEvent, UniqueEntityID } from 'clean-common-lib';
import { TransactionExternal } from '../TransactionExternal';

export class TransactionExteternalCreated implements IDomainEvent {
  public dateTimeOcurred: Date;
  public transactionExternal: TransactionExternal;

  constructor(transactionExternal: TransactionExternal) {
    this.dateTimeOcurred = new Date();
    this.transactionExternal = transactionExternal;
  }

  getAggregateId(): UniqueEntityID {
    return this.transactionExternal.id;
  }
}
