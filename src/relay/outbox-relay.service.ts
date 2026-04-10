import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { OutboxEventEntity } from '../payments/entities/outbox-event.entity';
import { KafkaService } from '../common/kafka/kafka.service';

@Injectable()
export class OutboxRelayService implements OnModuleInit {
  private readonly logger = new Logger(OutboxRelayService.name);
  private isProcessing = false;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(OutboxEventEntity)
    private readonly outboxRepository: Repository<OutboxEventEntity>,
    private readonly kafkaService: KafkaService,
  ) {}

  onModuleInit(): void {
    const interval = Number(this.configService.get('OUTBOX_POLL_INTERVAL_MS', 5000));
    setInterval(() => {
      void this.processPendingEvents();
    }, interval);
  }

  async processPendingEvents(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const batchSize = Number(this.configService.get('OUTBOX_BATCH_SIZE', 50));
      const events = await this.outboxRepository.find({
        where: [
          { status: 'PENDING' },
          { status: 'FAILED', nextRetryAt: LessThanOrEqual(new Date()) },
        ],
        order: { createdAt: 'ASC' },
        take: batchSize,
      });

      if (!events.length) {
        return;
      }

      this.logger.log(`Found ${events.length} outbox event(s) to process`);

      for (const event of events) {
        try {
          await this.kafkaService.publish(event.topic, event.aggregateId, event.payload, event.headers);
          event.status = 'PUBLISHED';
          event.publishedAt = new Date();
          event.lastError = null;
          event.nextRetryAt = null;
          await this.outboxRepository.save(event);
          this.logger.log(`Published outbox event ${event.id} to topic ${event.topic}`);
        } catch (error) {
          const retryCount = event.retryCount + 1;
          event.retryCount = retryCount;
          event.status = 'FAILED';
          event.lastError = error instanceof Error ? error.message : 'Unknown publish error';
          event.nextRetryAt = new Date(Date.now() + Math.min(retryCount * 5000, 60000));
          await this.outboxRepository.save(event);
          this.logger.error(
            `Failed publishing outbox event ${event.id}. Retry count: ${retryCount}. Error: ${event.lastError}`,
          );
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}
