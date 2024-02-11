import { Controller, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChangeStatusCommand } from '@transaction/src/contexts/transaction-finance/application/change-status/ChangeStatusCommand';
import { CHANGE_STATUS_TRANSACTION_MESSAGE_PATTERN } from 'utils/utils/constants-global';

@Controller()
export class EventsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CHANGE_STATUS_TRANSACTION_MESSAGE_PATTERN)
  async handleTransactionValidate(@Payload(ValidationPipe) payload) {
    const command = new ChangeStatusCommand(
      payload.accountExternalId,
      payload.transactionStatus,
    );
    return this.commandBus.execute(command);
  }
}
