import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusChangedToPendingEvent } from 'src/domain/events/transaction-status-changed-to-pending.event';

@EventsHandler(TransactionStatusChangedToPendingEvent)
export class SendTransactionToValidateWhenIsPendingHandler
  implements
    IEventHandler<TransactionStatusChangedToPendingEvent>,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf(`transaction.validate`);
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  handle(event: TransactionStatusChangedToPendingEvent) {
    this.kafka.emit('transaction.validate', { value: { ...event } });
  }
}
