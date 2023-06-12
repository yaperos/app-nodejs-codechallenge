import { PubsubInterface } from '../domain/pubsub.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements PubsubInterface {
  constructor(
    @Inject('PROXY_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  publish(topic: string, message: unknown) {
    this.kafkaClient.emit(topic, message);
  }
}
