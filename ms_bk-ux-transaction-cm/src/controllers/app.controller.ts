import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionCommand } from 'src/commands/impl/create-transaction.command';
import { UpdateTransactionStatusCommand } from 'src/commands/impl/update-transaction-status.command';
import { EVENTS_TYPES, TOPICS } from 'src/config/constants/topics';
import { CreateTransactionRequestDto } from 'src/dtos/create-transaction-request.dto';
import { TransactionEventsRequestDto } from 'src/dtos/transaction-events-request.dto';

@Controller()
export class AppController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(TOPICS.TRANSACTION_CREATED)
  createTransaction(
    @Payload('data') createTransactionRequestDto: CreateTransactionRequestDto,
  ) {
    const response = this.commandBus.execute(
      new CreateTransactionCommand(
        createTransactionRequestDto.accountExternalIdDebit,
        createTransactionRequestDto.accountExternalIdCredit,
        createTransactionRequestDto.value,
        createTransactionRequestDto.transferTypeId,
      ),
    );

    return response;
  }

  @EventPattern(TOPICS.TRANSACTION_EVENTS)
  async onTransactionEvent(@Payload() data: TransactionEventsRequestDto) {
    const { eventType, payload } = data;

    switch (eventType) {
      case EVENTS_TYPES.TRANSACTION_VALIDATED:
        await this.commandBus.execute(
          new UpdateTransactionStatusCommand(
            payload.id as string,
            payload.status as number,
          ),
        );

        break;
    }
  }
}
