import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction-created.event';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE')
    private readonly antifraudClient: ClientKafka,
  ) {}

  async handleTransactionCreated(
    event: TransactionCreatedEvent,
  ): Promise<void> {
    await this.antifraudClient.connect();
    if (event.value > 1000) {
      event.transactionStatus = process.env.STATUS_REJECTED;
    } else {
      event.transactionStatus = process.env.STATUS_APPROVED;
    }
    this.antifraudClient.emit(process.env.TOPIC, {
      key: process.env.KEY,
      value: event,
    });
  }
}
