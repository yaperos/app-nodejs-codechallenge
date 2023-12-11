import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransaction } from '../application/create-transaction/CreateTransaction';
import { FindTransaction } from '../application/find-transaction/FindTransaction';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransaction: CreateTransaction,
    private readonly findTransaction: FindTransaction,
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.createTransaction.execute(createTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findTransaction.execute(id);
  }
}
