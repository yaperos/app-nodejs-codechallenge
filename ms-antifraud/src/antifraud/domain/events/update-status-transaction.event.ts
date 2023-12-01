import { EventBase } from '../../../shared/domain/events/EventBase.event';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { EventBusConstants } from '../../../shared/domain/constants/event-bus.constants';
import { plainToClass } from 'class-transformer';

export class UpdateStatusTransactionEvent extends EventBase {
  TOPIC: string;

  id: string;

  status: TransactionStatus;

  static create(
    data: Omit<UpdateStatusTransactionEvent, 'TOPIC'>,
  ): UpdateStatusTransactionEvent {
    return plainToClass(UpdateStatusTransactionEvent, {
      TOPIC: EventBusConstants.TOPIC_STATUS_TRANSACTION,
      id: data.id,
      status: data.status,
    });
  }
}
