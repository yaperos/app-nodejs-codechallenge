import { TRANSACTION_STATUS_UPDATED_TOPIC } from '@app/common';
import { TransactionStatusUpdatedRequest } from '@app/common/dto/transaction-status-updated.dto';
import { TransactionStatusUpdatedEvent } from '@app/common/events/transaction-status-updated.event';
import { Controller, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(TRANSACTION_STATUS_UPDATED_TOPIC)
  async transactionStatusUpdatedEventHandler(
    @Payload() payload: TransactionStatusUpdatedRequest,
  ) {
    this.logger.log(
      '3. Received message TransactionStatusUpdatedRequest:',
      payload,
    );
    const event = new TransactionStatusUpdatedEvent(payload);
    this.eventBus.publish(event);
  }
}
