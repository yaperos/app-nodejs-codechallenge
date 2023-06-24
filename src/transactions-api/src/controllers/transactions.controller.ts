import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SaveTransactionCommand } from 'src/handlers/commands/save-transaction.command';
import { TransferCreate } from 'src/types/transfer-create';

@Controller()
export class TransactionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createTransaction(@Body() body: TransferCreate) {
    return await this.commandBus.execute(
      new SaveTransactionCommand(
        body.accountExternalIdDebit,
        body.accountExternalIdCredit,
        body.transferTypeId,
        body.value,
      ),
    );
  }

  @Get()
  async getTransaction() {
    return 'Hello World';
  }
}
