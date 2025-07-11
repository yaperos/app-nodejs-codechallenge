import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxEventRepository } from 'src/domain/repositories/outbox-event.repository';
import { EventPublisher } from 'src/domain/interfaces/event-publisher.interface';
import { KAFKA_PATTERNS } from 'src/infrastructure/kafka/kafka.config';

@Injectable()
export class OutboxEventPublisher {
  constructor(
    @Inject('OutboxEventRepository')
    private readonly outboxEventRepository: OutboxEventRepository,
    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async processOutboxEvents(): Promise<void> {
    const unprocessedEvents =
      await this.outboxEventRepository.findUnprocessed();

    for (const event of unprocessedEvents) {
      try {
        await this.eventPublisher.publish(
          KAFKA_PATTERNS.TRANSACTION_CREATED,
          event.payload,
        );

        if (event.id) {
          await this.outboxEventRepository.markAsProcessed(event.id);
        }
      } catch (error) {
        console.error(`Failed to process outbox event ${event.id}:`, error);
      }
    }
  }
}
