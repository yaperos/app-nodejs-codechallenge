import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EVENT_STORE } from 'src/config/services';

@Injectable()
export class EventStoreService {
  constructor(@Inject(EVENT_STORE) private readonly kafka: ClientKafka) {}

  appendEvent(eventType: string, aggregateId: string, payload: any) {
    this.kafka.emit('transaction.events', {
      eventType,
      aggregateId,
      timestamp: new Date().toISOString(),
      payload,
    });
  }
}
