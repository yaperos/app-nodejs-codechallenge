import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class HelloWorldService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  getHello(): string {
    this.clientKafka.emit('healthcheck', JSON.stringify({ message: 'Hello!' }));
    return 'Hello World!';
  }
}
