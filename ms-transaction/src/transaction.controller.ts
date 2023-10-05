import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TransactionModel } from '@src/transaction.model';
import { Prisma, Transaction } from '@prisma/client';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionModel: TransactionModel) {}

  @Get('all')
  transactions() {
    return this.transactionModel.transactions();
  }

  @Get(':id')
  transaction(@Param('id') id: string) {
    return this.transactionModel.transaction(id);
  }

  @Post()
  async createTransaction(
    @Body() transactionData: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.transactionModel.createTransaction(transactionData);
  }
}
