import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventInterface } from './EventInterface';

@Injectable()
export class Producer {
  constructor(
    @Inject('MY_CLIENT_KAFKA') private readonly client: ClientKafka,
  ) {}

  async emit(event: EventInterface) {
    this.client.emit(event.attributes.topic, JSON.stringify(event));
  }
}
