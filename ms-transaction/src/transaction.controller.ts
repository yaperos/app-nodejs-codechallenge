import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaService } from '@src/core/services/kafka.services';
import { TransactionModel } from '@src/transaction.model';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly appService: AppService,
    private kafkaServices: KafkaService,
    private transactionModel: TransactionModel,
  ) {}

  @Get('all')
  getTransactions(): string {
    return '';
  }

  @Get()
  getTransaction(@Param('id') id: string): string {
    return id;
  }

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }
}
