import { Controller, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedEvent } from '../../../../../../../libs/common/src/events/transaction-created.event';
import {
  REPLICATE_TRANSACTION_CREATED_TOPIC,
  REPLICATE_TRANSACTION_UPDATED_TOPIC,
} from '@app/common';
import { TransactionCreatedRequest } from '@app/common/dto/transaction-created.dto';
import { TransactionStatusUpdatedRequest } from '@app/common/dto/transaction-status-updated.dto';
import { TransactionReadStatusUpdatedEvent } from '@app/common/events/transaction-read-status-updated.event';

@Controller('transactions')
export class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(REPLICATE_TRANSACTION_CREATED_TOPIC)
  async transactionCreatedEventHandler(
    @Payload() payload: TransactionCreatedRequest,
  ) {
    this.logger.log('1. Received new TransactionCreatedEvent:', payload);
    const event = new TransactionCreatedEvent(payload);
    this.eventBus.publish(event);
  }

  @EventPattern(REPLICATE_TRANSACTION_UPDATED_TOPIC)
  async transactionStatusUpdatedEventHandler(
    @Payload() payload: TransactionStatusUpdatedRequest,
  ) {
    this.logger.log(
      '4. Received update TransactionStatusUpdatedEvent:',
      payload,
    );
    const event = new TransactionReadStatusUpdatedEvent(payload);
    this.eventBus.publish(event);
  }
}
