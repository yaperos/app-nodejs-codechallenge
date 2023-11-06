import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionRejectedEvent } from 'src/domain/events/transaction-rejected.event';

const TRANSACTION_REJECTED = 'transaction.rejected';

@EventsHandler(TransactionRejectedEvent)
export class TransactionRejectedHandler
  implements
    IEventHandler<TransactionRejectedEvent>,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf(TRANSACTION_REJECTED);
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  handle(event: TransactionRejectedEvent) {
    this.kafka.send(TRANSACTION_REJECTED, { value: { ...event } }).subscribe();
  }
}
