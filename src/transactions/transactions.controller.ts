import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async getAllTransactions() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @EventPattern('transaction_status_changed')
  async updateTransactionStatus(
    @Body() data: { id: string; status: 'approved' | 'rejected' },
  ) {
    return await this.transactionsService.updateStatus(data.id, data.status);
  }
}
