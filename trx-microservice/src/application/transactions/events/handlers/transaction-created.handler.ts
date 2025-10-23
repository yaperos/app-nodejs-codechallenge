import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from '../transaction-created.event';
import { KafkaProducerService } from '../../../../infrastructure/config/messaging/kafka.producer';
import { TOPICS } from '../../../../shared/topics';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler implements IEventHandler<TransactionCreatedEvent> {
  constructor(private readonly kafka: KafkaProducerService) {}

  async handle(evt: TransactionCreatedEvent) {
    await this.kafka.emit(TOPICS.CREATE, {
      ...evt
    }, evt.transactionExternalId);
  }
}