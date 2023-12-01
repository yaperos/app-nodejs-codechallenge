import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventBase } from '../domain/events/EventBase.event';
import { EventBusConstants } from '../domain/constants/event-bus.constants';

@Injectable()
export class EventBusService {
  constructor(
    @Inject(EventBusConstants.NAME)
    private readonly eventBus: ClientKafka,
  ) {}

  async send(event: EventBase): Promise<void> {
    this.eventBus.emit(event.TOPIC, event.toString());
  }
}
