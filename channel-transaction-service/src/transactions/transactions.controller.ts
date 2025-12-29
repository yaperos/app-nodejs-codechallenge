import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';

import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private svc: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.svc.create(dto);
  }

  @Get(':transactionExternalId')
  get(@Param('transactionExternalId') id: string) {
    return this.svc.get(id);
  }
}
