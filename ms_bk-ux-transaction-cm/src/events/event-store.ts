import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EVENT_STORE } from 'src/config/constants/services';
import { EVENTS_TYPES } from 'src/config/constants/topics';
import { TransactionModel } from 'src/models/transaction.model';

@Injectable()
export class EventStore {
  constructor(@Inject(EVENT_STORE) private readonly kafka: ClientKafka) {}

  onTransactionCreatedEvent(payload: TransactionModel) {
    this.kafka.emit(EVENTS_TYPES.TRANSACTION_CREATED, {
      data: payload,
    });
  }

  onTransactionUpdatedEvent(payload: TransactionModel) {
    this.kafka.emit(EVENTS_TYPES.TRANSACTION_UPDATED, {
      data: payload,
    });
  }
}
