import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { GetTransactionDto } from './dtos/get-transaction.dto';
import {
  BadRequestErrorResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
} from '../../core/responses-error';
import { TransactionCreateResponse } from '../../application/dtos/transaction-response.dto';

import { CreateTransactionCommand } from '../../application/commands/create-transaction.command';
import { UpdateTransactionCommand } from '../../application/commands/update-transaction.command';
import { GetTransactionQuery } from '../../application/queries/get-transaction.query';

@ApiTags('Transaction')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Crear nueva transacción
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

    // Crear y ejecutar el comando de creación de transacción
    const command = new CreateTransactionCommand(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    );
    return await this.commandBus.execute(command);
  }

  // Manejar eventos de actualización de transacción
  @MessagePattern('update-transaction')
  async handleEventUpdateTransaction(@Payload() data: UpdateTransactionDto) {
    const { transactionExternalId, status } = data;

    // Crear y ejecutar el comando de actualización de transacción
    const command = new UpdateTransactionCommand(transactionExternalId, status);
    await this.commandBus.execute(command);
  }

  // Obtener detalles de una transacción
  @Get(':transactionExternalId')
  async getTransaction(@Param() params: GetTransactionDto) {
    const query = new GetTransactionQuery(params.transactionExternalId);
    return await this.queryBus.execute(query);
  }
}