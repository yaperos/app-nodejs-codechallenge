import { Body, Controller, Get, Inject, Post, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './transaction.dto';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransactionStatus } from '.prisma/client/transactions';

@Controller('transaction')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly transactionsService: TransactionsService,
    @Inject('TRANSACTIONS_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  @Get()
  async all() {
    return await this.transactionsService.all();
  }

  @Post()
  async create(@Body() data: TransactionDto) {
    const transaction = await this.transactionsService.create(data);
    await lastValueFrom(this.kafkaClient.emit('transactions', transaction));
    this.logger.log('Transaction created');
    return transaction;
  }

  @MessagePattern('anti-fraud')
  async complete(message: any) {
    await this.transactionsService.complete({
      transaction_id: message.transaction_id,
      status:
        message.status === 'APPROVED'
          ? TransactionStatus.APPROVED
          : TransactionStatus.REJECTED,
    });
    this.logger.log('Transaction completed', message.transaction_id);
  }
}
