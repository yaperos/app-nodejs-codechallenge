import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction/event/transaction-created.event';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

}
