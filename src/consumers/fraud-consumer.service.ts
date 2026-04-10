import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '../common/kafka/kafka.service';
import { CONSUMER_NAMES } from '../common/constants/consumer-names';
import { TOPICS } from '../common/constants/topics';
import { BaseEvent, PaymentCreatedPayload, PaymentFailedPayload, PaymentFraudReviewedPayload } from '../common/contracts/events';
import { IdempotencyService } from './idempotency.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FraudConsumerService implements OnModuleInit {
  private readonly logger = new Logger(FraudConsumerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaService.subscribe({
      groupId: this.configService.get<string>('KAFKA_GROUP_PAYMENT_CREATED', 'payment-created-group'),
      topic: TOPICS.PAYMENT_CREATED,
      eachMessage: async ({ value }) => this.handlePaymentCreated(value as BaseEvent<PaymentCreatedPayload>),
    });
  }

  private async handlePaymentCreated(event: BaseEvent<PaymentCreatedPayload>): Promise<void> {
    const alreadyProcessed = await this.idempotencyService.hasProcessed(CONSUMER_NAMES.FRAUD, event.eventId);
    if (alreadyProcessed) {
      return;
    }

    const threshold = Number(this.configService.get('FRAUD_MAX_APPROVED_AMOUNT', 5000));
    const approved = event.payload.amount <= threshold;
    const riskScore = approved ? 15 : 95;

    if (!approved) {
      const failedEvent: BaseEvent<PaymentFailedPayload> = {
        eventId: randomUUID(),
        eventType: 'payment.failed',
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        correlationId: event.correlationId,
        causationId: event.eventId,
        aggregateId: event.aggregateId,
        aggregateType: 'payment',
        country: event.country,
        payload: {
          paymentId: event.payload.paymentId,
          failedAt: new Date().toISOString(),
          source: 'fraud-consumer',
          reason: 'Amount exceeds fraud threshold',
          retryable: false,
        },
      };
      await this.kafkaService.publish(TOPICS.PAYMENT_FAILED, event.aggregateId, failedEvent as unknown as Record<string, unknown>);
      await this.idempotencyService.markProcessed(CONSUMER_NAMES.FRAUD, event.eventId, event.aggregateId);
      this.logger.warn(`Payment ${event.aggregateId} rejected by fraud rule`);
      return;
    }

    const reviewedEvent: BaseEvent<PaymentFraudReviewedPayload> = {
      eventId: randomUUID(),
      eventType: 'payment.fraud-reviewed',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      correlationId: event.correlationId,
      causationId: event.eventId,
      aggregateId: event.aggregateId,
      aggregateType: 'payment',
      country: event.country,
      payload: {
        paymentId: event.payload.paymentId,
        approved: true,
        riskScore,
      },
    };

    await this.kafkaService.publish(
      TOPICS.PAYMENT_FRAUD_REVIEWED,
      event.aggregateId,
      reviewedEvent as unknown as Record<string, unknown>,
    );
    await this.idempotencyService.markProcessed(CONSUMER_NAMES.FRAUD, event.eventId, event.aggregateId);
    this.logger.log(`Payment ${event.aggregateId} approved by fraud consumer`);
  }
}
