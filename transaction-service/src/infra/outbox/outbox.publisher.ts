import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EVENT_PUBLISHER, OUTBOX_REPOSITORY } from '@ports/tokens';
import { OutboxRepository } from '@ports/out/outbox-repository';
import { EventPublisher } from '@ports/out/event-publisher';
import { OutboxMessage } from '@domain/outbox';

const OUTBOX_LOCK_KEY = BigInt(4172);

@Injectable()
export class OutboxPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxPublisher.name);
  private timer: NodeJS.Timeout | null = null;
  private pollIntervalMs: number;
  private batchSize: number;
  private maxAttempts: number;
  private baseRetryDelayMs: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: OutboxRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {
    this.pollIntervalMs = this.configService.get<number>('outbox.pollIntervalMs', 2000);
    this.batchSize = this.configService.get<number>('outbox.batchSize', 50);
    this.maxAttempts = this.configService.get<number>('outbox.maxAttempts', 5);
    this.baseRetryDelayMs = this.configService.get<number>(
      'outbox.baseRetryDelayMs',
      1000,
    );
  }

  async onModuleInit(): Promise<void> {
    await this.processOnce();
    this.timer = setInterval(() => {
      void this.processOnce();
    }, this.pollIntervalMs);
    this.logger.log(`Outbox publisher started (interval ${this.pollIntervalMs} ms)`);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private calculateNextAttempt(attempts: number): Date {
    const effectiveAttempts = Math.min(attempts, this.maxAttempts);
    const delay = this.baseRetryDelayMs * Math.pow(2, Math.max(effectiveAttempts - 1, 0));
    return new Date(Date.now() + delay);
  }

  private async processOnce(): Promise<void> {
    try {
      const processed = await this.outboxRepository.withGlobalAdvisoryLock(
        OUTBOX_LOCK_KEY,
        async () => {
          const messages = await this.outboxRepository.dequeueBatch(this.batchSize);
          if (messages.length === 0) {
            return 0;
          }

          await Promise.all(messages.map((message) => this.handleMessage(message)));
          return messages.length;
        },
      );

      if (processed === null) {
        this.logger.verbose('Skipping outbox publish cycle, lock held by another worker');
      }
    } catch (error) {
      this.logger.error('Unexpected error publishing outbox messages', error as Error);
    }
  }

  private async handleMessage(message: OutboxMessage): Promise<void> {
    if (!message.id) {
      this.logger.warn('Skipping outbox message without id');
      return;
    }

    try {
      await this.eventPublisher.publishOutboxMessage(message);
      await this.outboxRepository.markPublished(message.id);
    } catch (error) {
      const currentAttempts = message.attempts ?? 0;
      const nextAttempts = Math.min(currentAttempts + 1, this.maxAttempts);
      const nextAttemptAt = this.calculateNextAttempt(nextAttempts);
      this.logger.error(
        `Failed to publish outbox message ${message.id}. Attempts: ${nextAttempts}`,
        error as Error,
      );
      await this.outboxRepository.markFailed(message.id, nextAttempts, nextAttemptAt);
    }
  }
}
