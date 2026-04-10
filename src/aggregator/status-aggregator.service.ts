import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '../common/kafka/kafka.service';
import { CONSUMER_NAMES } from '../common/constants/consumer-names';
import { TOPICS } from '../common/constants/topics';
import {
  BaseEvent,
  PaymentFailedPayload,
  PaymentFraudReviewedPayload,
  PaymentLedgerWrittenPayload,
  PaymentSettledPayload,
} from '../common/contracts/events';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { PaymentProcessingStatusEntity } from '../payments/entities/payment-processing-status.entity';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class StatusAggregatorService implements OnModuleInit {
  private readonly logger = new Logger(StatusAggregatorService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(PaymentProcessingStatusEntity)
    private readonly statusRepository: Repository<PaymentProcessingStatusEntity>,
    @InjectRepository(ConsumerProcessedEventEntity)
    private readonly processedRepository: Repository<ConsumerProcessedEventEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const groupId = this.configService.get<string>('KAFKA_GROUP_STATUS', 'payment-status-group');

    await this.kafkaService.subscribe({
      groupId: `${groupId}-fraud`,
      topic: TOPICS.PAYMENT_FRAUD_REVIEWED,
      eachMessage: async ({ value }) => this.handleFraudReviewed(value as BaseEvent<PaymentFraudReviewedPayload>),
    });
    await this.kafkaService.subscribe({
      groupId: `${groupId}-ledger`,
      topic: TOPICS.PAYMENT_LEDGER_WRITTEN,
      eachMessage: async ({ value }) => this.handleLedgerWritten(value as BaseEvent<PaymentLedgerWrittenPayload>),
    });
    await this.kafkaService.subscribe({
      groupId: `${groupId}-failed`,
      topic: TOPICS.PAYMENT_FAILED,
      eachMessage: async ({ value }) => this.handleFailed(value as BaseEvent<PaymentFailedPayload>),
    });
  }

  private async wasProcessed(consumerName: string, eventId: string): Promise<boolean> {
    return Boolean(await this.processedRepository.findOne({ where: { consumerName, eventId } }));
  }

  private async markProcessed(consumerName: string, eventId: string, aggregateId: string): Promise<void> {
    await this.processedRepository.save(
      this.processedRepository.create({ consumerName, eventId, aggregateId, processedAt: new Date() }),
    );
  }

  private async handleFraudReviewed(event: BaseEvent<PaymentFraudReviewedPayload>): Promise<void> {
    if (await this.wasProcessed(CONSUMER_NAMES.STATUS_FRAUD, event.eventId)) {
      return;
    }
    await this.statusRepository.update({ paymentId: event.payload.paymentId }, { fraudStatus: 'succeeded' });
    await this.tryFinalize(event.payload.paymentId, event);
    await this.markProcessed(CONSUMER_NAMES.STATUS_FRAUD, event.eventId, event.aggregateId);
  }

  private async handleLedgerWritten(event: BaseEvent<PaymentLedgerWrittenPayload>): Promise<void> {
    if (await this.wasProcessed(CONSUMER_NAMES.STATUS_LEDGER, event.eventId)) {
      return;
    }
    await this.statusRepository.update({ paymentId: event.payload.paymentId }, { ledgerStatus: 'succeeded' });
    await this.tryFinalize(event.payload.paymentId, event);
    await this.markProcessed(CONSUMER_NAMES.STATUS_LEDGER, event.eventId, event.aggregateId);
  }

  private async handleFailed(event: BaseEvent<PaymentFailedPayload>): Promise<void> {
    if (await this.wasProcessed(CONSUMER_NAMES.STATUS_FAILED, event.eventId)) {
      return;
    }

    await this.statusRepository.update(
      { paymentId: event.payload.paymentId },
      { finalStatus: 'failed', failureReason: event.payload.reason },
    );
    await this.paymentRepository.update({ id: event.payload.paymentId }, { status: 'failed' });
    await this.markProcessed(CONSUMER_NAMES.STATUS_FAILED, event.eventId, event.aggregateId);
    this.logger.warn(`Payment ${event.payload.paymentId} marked as failed`);
  }

  private async tryFinalize(paymentId: string, triggeringEvent: BaseEvent<unknown>): Promise<void> {
    const status = await this.statusRepository.findOne({ where: { paymentId } });
    if (!status || status.finalStatus !== 'pending') {
      return;
    }

    if (status.fraudStatus === 'succeeded' && status.ledgerStatus === 'succeeded') {
      await this.statusRepository.update({ paymentId }, { finalStatus: 'settled' });
      await this.paymentRepository.update({ id: paymentId }, { status: 'settled' });

      const settledEvent: BaseEvent<PaymentSettledPayload> = {
        eventId: randomUUID(),
        eventType: 'payment.settled',
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        correlationId: triggeringEvent.correlationId,
        causationId: triggeringEvent.eventId,
        aggregateId: paymentId,
        aggregateType: 'payment',
        country: triggeringEvent.country as string,
        payload: {
          paymentId,
          settledAt: new Date().toISOString(),
        },
      };
      await this.kafkaService.publish(TOPICS.PAYMENT_SETTLED, paymentId, settledEvent as unknown as Record<string, unknown>);
      this.logger.log(`Payment ${paymentId} marked as settled`);
    }
  }
}
