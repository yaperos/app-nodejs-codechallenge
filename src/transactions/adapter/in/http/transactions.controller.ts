import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from '../../../use-case/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction-dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

  @Post()
  create(@Body() body: CreateTransactionDto) {
    return this.transactionsService.create(body);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}