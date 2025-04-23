import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionCommand } from 'src/commands/impl/create-transaction.command';
import { UpdateTransactionStatusCommand } from 'src/commands/impl/update-transaction-status.command';
import { CreateTransactionRequestDto } from 'src/dtos/create-transaction-request.dto';

@Controller()
export class AppController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('transaction.create')
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

  @EventPattern('transaction.events')
  async onTransactionEvent(data) {
    console.log({ data });

    const { eventType, payload } = data;

    switch (eventType) {
      case 'transaction.validated':
        await this.commandBus.execute(
          new UpdateTransactionStatusCommand(payload.id, payload.status),
        );

        break;
    }
  }
}
