import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionService.getTransaction(id);
  }
}
