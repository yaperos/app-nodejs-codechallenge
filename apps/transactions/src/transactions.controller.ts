import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './transaction.dto';
import { TransactionStatus } from '@prisma/client';
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
