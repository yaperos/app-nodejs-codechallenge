import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionCommand } from 'src/commands/impl/create-transaction.command';
import { UpdateTransactionStatusCommand } from 'src/commands/impl/update-transaction-status.command';
import { TOPICS } from 'src/config/constants/topics';
import { CreateTransactionRequestDto } from 'src/dtos/create-transaction-request.dto';
import { UpdateTransactionStatusRequestDto } from 'src/dtos/update-transaction-status-request.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(TOPICS.TRANSACTION_CREATED)
  createTransaction(@Payload('data') data: CreateTransactionRequestDto) {
    this.logger.log('createTransaction', data);
    const response = this.commandBus.execute(
      new CreateTransactionCommand(
        data.accountExternalIdDebit,
        data.accountExternalIdCredit,
        data.value,
        data.transferTypeId,
      ),
    );

    return response;
  }

  @EventPattern(TOPICS.TRANSACTION_VALIDATED)
  async onTransactionValidated(
    @Payload('data') data: UpdateTransactionStatusRequestDto,
  ) {
    this.logger.log('onTransactionValidated', data);
    const { id, status } = data;

    await this.commandBus.execute(
      new UpdateTransactionStatusCommand(id, status),
    );
  }
}
