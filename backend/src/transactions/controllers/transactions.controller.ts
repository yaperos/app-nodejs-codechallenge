import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {

  constructor(
    private transactionsService: TransactionsService
  ) {}

  @Get(':transactionId')
  async getTransaction(@Param('transactionId', ParseUUIDPipe) transactionId: string) {
    return this.transactionsService.findOne(transactionId);
  }

  @Post()
  async create(@Body() body: CreateTransactionDto) {
    return this.transactionsService.create(body);
  }
}
