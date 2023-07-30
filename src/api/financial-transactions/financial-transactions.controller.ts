import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';

import { CreateFinancialTransaction as CreateFinancialTransactionUseCase } from 'src/domain/financial-transactions/create';
import {
  CreateFinancialTransactionResponse,
  CreateFinancialTransactionWithErrorsResponse,
} from './dtos/create/response/create-financial-transaction-response.dto';
import { CreateFinancialTransactionRequest } from './dtos/create/request/create-financial-transaction-request.dto';

@ApiBearerAuth()
@Controller('transactions')
export class FinancialTransactionsController {
  constructor(private readonly createFinancialTransactionUseCase: CreateFinancialTransactionUseCase) {}

  @ApiTags('Financial Transaction')
  @ApiOperation({
    summary: 'Create a financial transaction',
    description: 'Create a financial transaction with its data. Returns a financial transaction with status pending',
  })
  @ApiOkResponse({
    description: 'Financial transaction created correctly',
    type: CreateFinancialTransactionResponse,
  })
  @ApiResponse({
    description: 'Financial transaction errors',
    type: CreateFinancialTransactionWithErrorsResponse,
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiBody({
    description: 'This endpoint create a financial transaction',
    type: CreateFinancialTransactionRequest,
  })
  @Post('/create')
  async createFinancialTransaction(@Body() body: CreateFinancialTransactionRequest) {
    return await this.createFinancialTransactionUseCase.execute({
      value: body.value,
      transactionType: body.transactionType,
    });
  }
}
