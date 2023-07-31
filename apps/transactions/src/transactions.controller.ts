import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './transaction.dto';
import { TransactionStatus } from '.prisma/client/transactions';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  all() {
    return this.transactionsService.all();
  }

  @Post()
  create(@Body() data: TransactionDto) {
    return this.transactionsService.create(data);
  }
  @Get(':transactionId')
  getById(@Param('transactionId') transactionId: string){
    return this.transactionsService.findByID(transactionId);
  }

  @MessagePattern('antifraud')
  async complete(@Payload() message: any) {
    await this.transactionsService.complete(
      message.id,
      message.status === 0
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED,
    );
  }
}
