import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: GetTransactionDto,
  })
  async createTransaction(@Body() data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by id' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully retrieved.',
    type: GetTransactionDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    example: '60c06d21-9fd2-4de6-89b6-c196c66e9aa2',
  })
  async getTransactionById(id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
