import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '../common/kafka/kafka.service';
import { CONSUMER_NAMES } from '../common/constants/consumer-names';
import { TOPICS } from '../common/constants/topics';
import { BaseEvent, PaymentCreatedPayload, PaymentLedgerWrittenPayload } from '../common/contracts/events';
import { IdempotencyService } from './idempotency.service';
import { LedgerEntryEntity } from '../payments/entities/ledger-entry.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class LedgerConsumerService implements OnModuleInit {
  private readonly logger = new Logger(LedgerConsumerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    private readonly idempotencyService: IdempotencyService,
    @InjectRepository(LedgerEntryEntity)
    private readonly ledgerRepository: Repository<LedgerEntryEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaService.subscribe({
      groupId: `${this.configService.get<string>('KAFKA_GROUP_PAYMENT_CREATED', 'payment-created-group')}-ledger`,
      topic: TOPICS.PAYMENT_CREATED,
      eachMessage: async ({ value }) => this.handlePaymentCreated(value as BaseEvent<PaymentCreatedPayload>),
    });
  }

  private async handlePaymentCreated(event: BaseEvent<PaymentCreatedPayload>): Promise<void> {
    const alreadyProcessed = await this.idempotencyService.hasProcessed(CONSUMER_NAMES.LEDGER, event.eventId);
    if (alreadyProcessed) {
      return;
    }

    const ledgerEntryId = randomUUID();
    const debitAccount = `wallet:${event.payload.userId}`;
    const creditAccount = 'merchant:settlement';

    const entry = this.ledgerRepository.create({
      id: ledgerEntryId,
      paymentId: event.payload.paymentId,
      debitAccount,
      creditAccount,
      amount: event.payload.amount.toFixed(2),
      currency: event.payload.currency,
    });
    await this.ledgerRepository.save(entry);

    const ledgerWrittenEvent: BaseEvent<PaymentLedgerWrittenPayload> = {
      eventId: randomUUID(),
      eventType: 'payment.ledger-written',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      correlationId: event.correlationId,
      causationId: event.eventId,
      aggregateId: event.aggregateId,
      aggregateType: 'payment',
      country: event.country,
      payload: {
        paymentId: event.payload.paymentId,
        ledgerEntryId,
        debitAccount,
        creditAccount,
        amount: event.payload.amount,
        currency: event.payload.currency,
      },
    };

    await this.kafkaService.publish(
      TOPICS.PAYMENT_LEDGER_WRITTEN,
      event.aggregateId,
      ledgerWrittenEvent as unknown as Record<string, unknown>,
    );
    await this.idempotencyService.markProcessed(CONSUMER_NAMES.LEDGER, event.eventId, event.aggregateId);
    this.logger.log(`Payment ${event.aggregateId} posted to ledger`);
  }
}
