import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';

import { CreateFinancialTransaction as CreateFinancialTransactionUseCase } from 'src/domain/financial-transactions/create';
import {
  FinancialTransactionResponse,
  FinancialTransactionWithErrorsResponse,
} from './dtos/create/response/create-financial-transaction-response.dto';
import { CreateFinancialTransactionRequest } from './dtos/create/request/create-financial-transaction-request.dto';
import { ViewFinancialTransaction as ViewFinancialTransactionUseCase } from '../../domain/financial-transactions/view';

@ApiBearerAuth()
@Controller('transactions')
export class FinancialTransactionsController {
  constructor(
    private readonly createFinancialTransactionUseCase: CreateFinancialTransactionUseCase,
    private readonly viewFinancialTransactionUseCase: ViewFinancialTransactionUseCase,
  ) {}

  @ApiTags('Financial Transaction')
  @ApiOperation({
    summary: 'Create a financial transaction',
    description: 'Create a financial transaction with its data. Returns a financial transaction with status pending',
  })
  @ApiOkResponse({
    description: 'Financial transaction created correctly',
    type: FinancialTransactionResponse,
  })
  @ApiResponse({
    description: 'Financial transaction errors',
    type: FinancialTransactionWithErrorsResponse,
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiBody({
    description: 'This endpoint create a financial transaction',
    type: CreateFinancialTransactionRequest,
  })
  @Post('/create')
  async createFinancialTransaction(@Body() body: CreateFinancialTransactionRequest) {
    return await this.createFinancialTransactionUseCase.execute({
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      value: body.value,
      transactionType: body.transactionType,
    });
  }

  @ApiTags('Financial Transaction')
  @ApiOperation({
    summary: 'Search a financial transaction',
    description:
      'Search a financial transaction by id or by transactionExternalId. Returns a financial transaction with its actual status',
  })
  @ApiOkResponse({
    description: 'Financial transaction data',
    type: FinancialTransactionResponse,
  })
  @ApiResponse({
    description: 'Financial transaction errors',
    type: FinancialTransactionWithErrorsResponse,
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    description: 'The transaction ID does not exists',
    status: HttpStatus.NOT_FOUND,
  })
  @Get('/view')
  async getFinancialTransaction(@Query() query: { id?: string; transactionExternalId?: string }) {
    return await this.viewFinancialTransactionUseCase.execute({
      id: parseInt(query.id),
      transactionExternalId: query.transactionExternalId,
    });
  }
}
