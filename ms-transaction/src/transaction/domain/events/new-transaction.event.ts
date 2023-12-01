import { plainToClass } from 'class-transformer';
import { EventBase } from '../../../shared/domain/events/EventBase.event';
import { EventBusConstants } from '../../../shared/domain/constants/event-bus.constants';

export class NewTransactionEvent extends EventBase {
  TOPIC: string;

  id: string;

  value: number;

  static create(data: Omit<NewTransactionEvent, 'TOPIC'>): NewTransactionEvent {
    return plainToClass(NewTransactionEvent, {
      TOPIC: EventBusConstants.TOPIC_NEW_TRANSACTION,
      id: data.id,
      value: data.value,
    });
  }
}
