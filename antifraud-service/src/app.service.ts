import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApprovedEvent } from './events/approved.event';
import { CreatedEvent } from './events/create.event';
import { RejectedEvent } from './events/rejected.event';
import { VALIDATE_TRANSACTION } from './constants/constants';

@Injectable()
export class AppService {
  constructor(@Inject('KAFKA') private clientEmit: ClientKafka) {}

  async validateTransaction(payload: CreatedEvent): Promise<void> {
    const resultEvent =
      payload.value > VALIDATE_TRANSACTION.MAX_VALUE
        ? RejectedEvent
        : ApprovedEvent;
    this.clientEmit.emit(resultEvent.getName(), resultEvent.toEvent(payload));
  }
}
