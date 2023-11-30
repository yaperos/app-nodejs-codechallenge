import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createTransactionDto);
  }

  /*   @Patch()
    async update(@Body() updateTransactionDto: UpdateTransactionDto) {
      return await this.transactionService.updateStatusTransaction(updateTransactionDto);
    } */

  @Get()
  findAll() {
    return this.transactionService.findTransactions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findTransactionById(id);
  }

}
