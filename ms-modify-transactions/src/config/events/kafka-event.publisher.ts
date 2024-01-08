import { Inject, Injectable } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
  constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {}

  publish<T extends IEvent = IEvent>(event: T) {
    const topic = 'queue-transactions-created-topic';
    const payload = JSON.stringify(event);

    console.log(`Publishing event to ${topic}: ${payload}`);
    this.kafkaClient.emit(topic, payload);
  }
}
