import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
  })
  async createTransaction(@Body() data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }
}
