import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionDto } from './create-transaction.dto';
import { CreateTransactionCommand } from '../../../application/commands/create-transaction.command';

@Controller('transactions')
export class CreateTransactionController {
  private readonly logger: Logger = new Logger(
    CreateTransactionController.name,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() data: CreateTransactionDto): Promise<void> {
    this.logger.log(`body: ${JSON.stringify(data)}`);
    const command = new CreateTransactionCommand(
      data.accountExternalIdDebit,
      data.accountExternalIdCredit,
      data.transferTypeId,
      data.value,
    );
    await this.commandBus.execute(command);
  }
}
