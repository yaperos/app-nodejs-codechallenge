import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionStatusDto } from './dto/transaction-status.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return await this.transactionsService.getTransaction(id);
  }

  @Post()
  async createTransaction(@Body() createTransaction: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(createTransaction);
  }

  @EventPattern('transaction_validated')
  async updateTransactionStatus(@Payload() data: TransactionStatusDto) {
    console.log('updateTransactionStatus', data);
    return await this.transactionsService.updateTransactionStatus(data);
  }
}
