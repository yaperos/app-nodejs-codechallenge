import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { KafkaProducerService } from './kafka-producer.service.js';
import { OUTBOX_EVENT_TRANSACTION_CREATED, KAFKA_CONFIG } from '../../../common/kafka/kafka.constants.js';

const INTERVAL_MS = 400;

@Injectable()
export class OutboxRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelayService.name);
  private timer: ReturnType<typeof setInterval> | undefined;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly producer: KafkaProducerService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    if (!this.producer.isEnabled()) {
      this.logger.warn('Outbox relay skipped (Kafka disabled)');
      return;
    }
    const enabled =
      this.config.get<string>(KAFKA_CONFIG.ENABLE_OUTBOX_RELAY) !== 'false';
    if (!enabled) {
      this.logger.warn('Outbox relay disabled');
      return;
    }
    this.timer = setInterval(() => void this.tick(), INTERVAL_MS);
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private async tick(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;
    try {
      await this.flushBatch();
    } catch (e) {
      this.logger.error('Outbox relay tick failed', e);
    } finally {
      this.running = false;
    }
  }

  private async flushBatch(): Promise<void> {
    if (!this.producer.canPublish()) {
      return;
    }

    const batch = await this.prisma.outboxEvent.findMany({
      where: { status: 'pending' },
      orderBy: { id: 'asc' },
      take: 25,
    });

    for (const row of batch) {
      if (row.eventType !== OUTBOX_EVENT_TRANSACTION_CREATED) {
        continue;
      }
      try {
        await this.producer.publishJson(
          this.producer.topicTransactionCreated,
          row.aggregateId,
          row.payload as object,
        );
      } catch (e) {
        this.logger.warn(`Outbox publish failed for ${row.id}, will retry`, e);
        continue;
      }
      await this.prisma.outboxEvent.update({
        where: { id: row.id },
        data: {
          status: 'published',
          publishedAt: new Date(),
        },
      });
    }
  }
}
