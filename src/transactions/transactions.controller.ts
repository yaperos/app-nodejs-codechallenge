import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { STATUSES, limitAmout } from 'src/config/config';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionsService.create(createTransactionDto);
    return transaction;
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) {
      return { message: 'Transaction not found' };
    }
    return transaction;
  }

  @Get()
  async getAllTransactions() {
    return await this.transactionsService.findAll();
  }
}
