import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateTransactionDto, TransactionDto } from '../../../application/transactions/dto/transaction.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../../../application/transactions/commands/create-transaction.command';
import { RetrieveTransactionQuery } from 'src/application/transactions/queries/retrieve-transaction.query';
import { RetrieveTransactionResult } from 'src/application/transactions/queries/handlers/retrieve-transaction.handler';

@Controller()
export class TransactionsApiController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get(':id')
  async retrieveTransaction(@Param('id') transactionExternalId: string): Promise<TransactionDto> {
    const result = await this.queryBus.execute<RetrieveTransactionQuery, RetrieveTransactionResult>(
      new RetrieveTransactionQuery(transactionExternalId)
    )
    return result.transaction
  }


  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
     const id = await this.commandBus.execute<CreateTransactionCommand, string>(
      new CreateTransactionCommand(
        dto.accountExternalIdDebit,
        dto.accountExternalIdCredit,
        dto.tranferTypeId,
        dto.value
      )
    )

    return { id }
  }
}
