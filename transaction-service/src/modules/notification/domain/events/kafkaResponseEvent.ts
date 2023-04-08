import { IDomainEvent, UniqueEntityID } from 'clean-common-lib';
import { KafkaNotification } from '../kafkaNotification';

export class TransactionExternalResponseEvent implements IDomainEvent {
  public dateTimeOcurred: Date;
  public data: KafkaNotification;

  constructor(data: KafkaNotification) {
    this.dateTimeOcurred = new Date();
    this.data = data;
  }

  getAggregateId(): UniqueEntityID {
    throw new Error('Method not implemented.');
  }
}
