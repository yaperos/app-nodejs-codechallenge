import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { KafkaService } from '../common/kafka/kafka.service';
import { CONSUMER_NAMES } from '../common/constants/consumer-names';
import { TOPICS } from '../common/constants/topics';
import { BaseEvent, PaymentFailedPayload, PaymentSettledPayload } from '../common/contracts/events';
import { NotificationEntity } from '../payments/entities/notification.entity';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';

@Injectable()
export class NotifyConsumerService implements OnModuleInit {
  private readonly logger = new Logger(NotifyConsumerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(ConsumerProcessedEventEntity)
    private readonly processedRepository: Repository<ConsumerProcessedEventEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const groupId = this.configService.get<string>('KAFKA_GROUP_NOTIFY', 'payment-notify-group');
    await this.kafkaService.subscribe({
      groupId: `${groupId}-settled`,
      topic: TOPICS.PAYMENT_SETTLED,
      eachMessage: async ({ value }) => this.handleSettled(value as BaseEvent<PaymentSettledPayload>),
    });
    await this.kafkaService.subscribe({
      groupId: `${groupId}-failed`,
      topic: TOPICS.PAYMENT_FAILED,
      eachMessage: async ({ value }) => this.handleFailed(value as BaseEvent<PaymentFailedPayload>),
    });
  }

  private async alreadyProcessed(consumerName: string, eventId: string): Promise<boolean> {
    return Boolean(await this.processedRepository.findOne({ where: { consumerName, eventId } }));
  }

  private async markProcessed(consumerName: string, eventId: string, aggregateId: string): Promise<void> {
    await this.processedRepository.save(
      this.processedRepository.create({ consumerName, eventId, aggregateId, processedAt: new Date() }),
    );
  }

  private async handleSettled(event: BaseEvent<PaymentSettledPayload>): Promise<void> {
    if (await this.alreadyProcessed(CONSUMER_NAMES.NOTIFY_SETTLED, event.eventId)) {
      return;
    }

    await this.notificationRepository.save(
      this.notificationRepository.create({
        id: randomUUID(),
        paymentId: event.payload.paymentId,
        channel: 'email',
        status: 'sent',
        payload: { message: `Payment ${event.payload.paymentId} settled successfully` },
      }),
    );
    await this.markProcessed(CONSUMER_NAMES.NOTIFY_SETTLED, event.eventId, event.aggregateId);
    this.logger.log(`Notification sent for settled payment ${event.payload.paymentId}`);
  }

  private async handleFailed(event: BaseEvent<PaymentFailedPayload>): Promise<void> {
    if (await this.alreadyProcessed(CONSUMER_NAMES.NOTIFY_FAILED, event.eventId)) {
      return;
    }

    await this.notificationRepository.save(
      this.notificationRepository.create({
        id: randomUUID(),
        paymentId: event.payload.paymentId,
        channel: 'email',
        status: 'sent',
        payload: { message: `Payment ${event.payload.paymentId} failed: ${event.payload.reason}` },
      }),
    );
    await this.markProcessed(CONSUMER_NAMES.NOTIFY_FAILED, event.eventId, event.aggregateId);
    this.logger.log(`Notification sent for failed payment ${event.payload.paymentId}`);
  }
}
