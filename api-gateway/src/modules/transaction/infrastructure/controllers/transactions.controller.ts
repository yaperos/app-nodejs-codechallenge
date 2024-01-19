import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocResponse } from 'src/modules/shared/infrastructure/decorators/api-doc-response.decorator';
import { HttpExceptionFilter } from 'src/modules/shared/infrastructure/filters/http-exception.filter';

import { TransactionCreator } from '../../application/use-cases/transaction-creator.use-case';
import { TransactionFinder } from '../../application/use-cases/transaction-finder.use-case';
import { CreateTransactionRequestDto } from '../dtos/request/create-transaction-request.dto';
import { TransactionResponseDto } from '../dtos/response/transaction-response.dto';

@UseFilters(new HttpExceptionFilter())
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionCreator: TransactionCreator,
    private readonly transactionFinder: TransactionFinder,
  ) {}

  @ApiOperation({
    description: 'Create a transaction',
    operationId: 'postTransaction',
  })
  @ApiDocResponse(
    {
      status: HttpStatus.CREATED,
      description: 'The transaction',
      type: TransactionResponseDto,
    },
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const transactionCreated =
      await this.transactionCreator.run(createTransactionDto);
    return transactionCreated;
  }

  @ApiOperation({
    description: 'Get a transaction by ID',
    operationId: 'getTransaction',
  })
  @ApiDocResponse(
    {
      status: HttpStatus.OK,
      description: 'The transaction',
      type: TransactionResponseDto,
    },
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Get(':transactionExternalId')
  async findOne(
    @Param('transactionExternalId', ParseUUIDPipe) transactionId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionFinder.run(transactionId);
    return transaction;
  }
}
