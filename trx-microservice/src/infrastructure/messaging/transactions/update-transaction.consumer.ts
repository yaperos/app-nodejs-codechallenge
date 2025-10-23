import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { TOPICS, ReviewedTransactionEvent } from '../../../shared/topics';
import { parseMessage } from '../../../shared/utils';
import { UpdateTransactionCommand } from '../../../application/transactions/commands/update-transaction.command';
import { TRANSACTION_STATUS } from '../../../domain/transactions/transaction';

@Controller()
export class UpdateTransactionConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TOPICS.APPROVED)
  async onApproved(@Payload() message: any) {
    const value = parseMessage<ReviewedTransactionEvent>(message);
    await this.commandBus.execute(
      new UpdateTransactionCommand(value.transactionExternalId, TRANSACTION_STATUS.APPROVED),
    );
  }

  @EventPattern(TOPICS.REJECTED)
  async onRejected(@Payload() message: any) {
    const value = parseMessage<ReviewedTransactionEvent>(message);
    await this.commandBus.execute(
      new UpdateTransactionCommand(value.transactionExternalId, TRANSACTION_STATUS.REJECTED),
    );
  }
}