import { KafkaConnection } from 'nestjs-kafkajs';
import { DomainEvent } from '../domain/domain-event';
import { EventBus } from '../domain/event-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaEventBus implements EventBus {
  constructor(private readonly kafkaConnection: KafkaConnection) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.kafkaConnection.publish(event.eventName, event.toPrimitives());
  }
}
