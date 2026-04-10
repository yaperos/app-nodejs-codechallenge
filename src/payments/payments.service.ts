import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentEntity } from './entities/payment.entity';
import { OutboxEventEntity } from './entities/outbox-event.entity';
import { PaymentProcessingStatusEntity } from './entities/payment-processing-status.entity';
import { TOPICS } from '../common/constants/topics';
import { BaseEvent, PaymentCreatedPayload } from '../common/contracts/events';

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(PaymentProcessingStatusEntity)
    private readonly processingStatusRepository: Repository<PaymentProcessingStatusEntity>,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const paymentId = randomUUID();
    const eventId = randomUUID();
    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      const payment = manager.create(PaymentEntity, {
        id: paymentId,
        userId: dto.userId,
        country: dto.country,
        amount: dto.amount.toFixed(2),
        currency: dto.currency,
        status: 'pending',
      });
      await manager.save(payment);

      const processingStatus = manager.create(PaymentProcessingStatusEntity, {
        paymentId,
        fraudStatus: 'pending',
        ledgerStatus: 'pending',
        finalStatus: 'pending',
        failureReason: null,
      });
      await manager.save(processingStatus);

      const event: BaseEvent<PaymentCreatedPayload> = {
        eventId,
        eventType: 'payment.created',
        eventVersion: 1,
        occurredAt: now.toISOString(),
        correlationId: eventId,
        aggregateId: paymentId,
        aggregateType: 'payment',
        country: dto.country,
        payload: {
          paymentId,
          userId: dto.userId,
          amount: dto.amount,
          currency: dto.currency,
          country: dto.country,
          createdAt: now.toISOString(),
        },
      };

      const outbox = manager.create(OutboxEventEntity, {
        id: randomUUID(),
        aggregateId: paymentId,
        aggregateType: 'payment',
        topic: TOPICS.PAYMENT_CREATED,
        eventType: 'payment.created',
        eventVersion: 1,
        payload: event as unknown as Record<string, unknown>,
        headers: { correlationId: event.correlationId },
        status: 'PENDING',
        retryCount: 0,
        nextRetryAt: null,
        publishedAt: null,
        lastError: null,
      });
      await manager.save(outbox);
    });

    return {
      paymentId,
      status: 'pending',
      updatedAt: now.toISOString(),
    };
  }

  async getPaymentById(paymentId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }

    const processing = await this.processingStatusRepository.findOne({ where: { paymentId } });

    return {
      paymentId: payment.id,
      status: payment.status as 'pending' | 'settled' | 'failed',
      fraudStatus: processing?.fraudStatus as 'pending' | 'succeeded' | 'failed',
      ledgerStatus: processing?.ledgerStatus as 'pending' | 'succeeded' | 'failed',
      failureReason: processing?.failureReason ?? null,
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
