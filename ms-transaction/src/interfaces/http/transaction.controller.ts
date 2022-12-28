import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CreateTransactionCommand } from '../../application/commands/create-transaction.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionCommand } from '../../application/commands/update-transaction.command';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { GetTransactionDto } from './dtos/get-transaction.dto';
import { GetTransactionQuery } from '../../application/queries/get-transaction.query';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestErrorResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
} from '../../core/responses-error';
import {TransactionCreateResponse} from "../../application/dtos/transaction-response.dto";

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @ApiResponse({
    status: 201,
    description: 'Create new transaction',
    type: TransactionCreateResponse,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponse,
    description: 'Error inputs',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error server',
    type: InternalServerErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'No sessions found',
    type: NotFoundResponse,
  })
  @Post()
  async create(@Body() body: CreateTransactionDto) {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = body;
    const command = new CreateTransactionCommand(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    return await this.commandBus.execute(command);
  }
  @MessagePattern('update-transaction')
  async handleEventUpdateTransaction(@Payload() data: UpdateTransactionDto) {
    const { transactionExternalId, status } = data;
    const command = new UpdateTransactionCommand(transactionExternalId, status);
    await this.commandBus.execute(command);
  }

  @Get(':transactionExternalId')
  async getTransaction(@Param() params: GetTransactionDto) {
    console.log(params);
    const query = new GetTransactionQuery(params.transactionExternalId);
    return await this.queryBus.execute(query);
  }
}
