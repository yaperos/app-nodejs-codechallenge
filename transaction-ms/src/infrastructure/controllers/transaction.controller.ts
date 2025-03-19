import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from 'src/application/use-cases/get-transaction.usecase';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { CreateTransactionRequest } from '../request/CreateTransactionRequest';



@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @Post()
  @ApiBody({ type: CreateTransactionRequest })
  @ApiResponse({ status: 201, description: 'Transacción creada' })
  async create(@Body() dto: CreateTransactionRequest): Promise<TransactionEntity> {
    return this.createTransactionUseCase.execute(dto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Detalles de la transacción' })
  async get(@Param('id') transactionExternalId: string): Promise<TransactionEntity> {
    return this.getTransactionUseCase.execute(transactionExternalId);
  }
}
