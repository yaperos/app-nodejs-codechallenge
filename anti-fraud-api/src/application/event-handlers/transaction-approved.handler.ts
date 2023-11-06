import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionApprovedEvent } from 'src/domain/events/transaction-approved.event';

const TRANSACTION_APPROVED = 'transaction.approved';

@EventsHandler(TransactionApprovedEvent)
export class TransactionApprovedHandler
  implements
    IEventHandler<TransactionApprovedEvent>,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    this.kafka.subscribeToResponseOf(TRANSACTION_APPROVED);
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  handle(event: TransactionApprovedEvent) {
    this.kafka.send(TRANSACTION_APPROVED, { value: { ...event } }).subscribe();
  }
}
