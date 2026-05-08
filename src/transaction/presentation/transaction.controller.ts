import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import {
  CreateTransactionResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto.js';
import { CreateTransactionCommand } from '../application/commands/create-transaction.command.js';
import { GetTransactionByExternalIdQuery } from '../application/queries/get-transaction-by-external-id.query.js';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: CreateTransactionResponseDto })
  async create(
    @Body() body: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    const result = await this.commandBus.execute(
      new CreateTransactionCommand(
        body.accountExternalIdDebit,
        body.accountExternalIdCredit,
        body.tranferTypeId,
        body.value,
      ),
    );
    const dto = new CreateTransactionResponseDto();
    dto.transactionExternalId = result.transactionExternalId;
    return dto;
  }

  @Get(':transactionExternalId')
  @ApiOkResponse({ type: TransactionResponseDto })
  async getOne(
    @Param('transactionExternalId', new ParseUUIDPipe({ version: '4' }))
    transactionExternalId: string,
  ): Promise<TransactionResponseDto> {
    return this.queryBus.execute(
      new GetTransactionByExternalIdQuery(transactionExternalId),
    );
  }
}
