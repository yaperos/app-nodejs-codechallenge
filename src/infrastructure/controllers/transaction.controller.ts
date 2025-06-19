import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { CreateTransactionDto } from '@application/dtos/create-transaction.dto';
import { TransactionResponseDto } from '@application/dtos/transaction-response.dto';
import { CreateTransactionHandler } from '@application/handlers/create-transaction.handler';
import { GetTransactionHandler } from '@application/handlers/get-transaction.handler';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionHandler: CreateTransactionHandler,
    private readonly getTransactionHandler: GetTransactionHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiHeader({
    name: 'x-correlation-id',
    description: 'Correlation ID for tracing',
    required: false,
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<TransactionResponseDto> {
    return this.createTransactionHandler.handle(createTransactionDto, correlationId);
  }

  @Get(':transactionExternalId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by external ID' })
  @ApiParam({
    name: 'transactionExternalId',
    description: 'Transaction external ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiHeader({
    name: 'x-correlation-id',
    description: 'Correlation ID for tracing',
    required: false,
  })
  async getTransaction(
    @Param('transactionExternalId') transactionExternalId: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<TransactionResponseDto> {
    return this.getTransactionHandler.handle(transactionExternalId, correlationId);
  }
} 