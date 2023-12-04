import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @EventPattern('transaction_status_handle')
  async transactionStatusHanlde({ transactionExternalId, status }) {
    return this.transactionService.statusHandle(transactionExternalId, status);
  }
}
