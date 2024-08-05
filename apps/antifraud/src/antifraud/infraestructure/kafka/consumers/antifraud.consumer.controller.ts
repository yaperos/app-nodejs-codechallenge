import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_VALIDATED_TOPIC } from '@app/common';
import { TransactionValidatedRequest } from '@app/common/dto/transaction-validated.dto';
import { TransactionValidatedEvent } from '@app/common/events/transaction-validated.event';
import { EventBus } from '@nestjs/cqrs';

@Controller('antifraud')
export class AntifraudConsumerController {
  private readonly logger = new Logger(AntifraudConsumerController.name);
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(TRANSACTION_VALIDATED_TOPIC)
  async ValidTransactionEventHandler(
    @Payload() payload: TransactionValidatedRequest,
  ) {
    this.logger.log('2. Valid TransactionValidatedRequest:', payload);
    const event = new TransactionValidatedEvent(payload);
    this.eventBus.publish(event);
  }
}
