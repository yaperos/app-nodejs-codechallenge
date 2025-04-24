import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EVENTS_TYPES } from 'src/config/contants/events';
import { EVENT_STORE } from 'src/config/contants/services';
import { TransactionValidatedEvent } from './event-store.types';

@Injectable()
export class EventStoreService {
  constructor(@Inject(EVENT_STORE) private readonly kafka: ClientKafka) {}

  onTransactionValidatedEvent(payload: TransactionValidatedEvent) {
    this.kafka.emit(EVENTS_TYPES.TRANSACTION_VALIDATED, {
      data: payload,
    });
  }
}
