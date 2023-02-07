import {
  Body,
  Controller,
  Put,
  Post,
  Param,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  // async onModuleInit() {
  //   // this.client.getConsumerAssignments('transaction.update.reply')
  //   this.client.subscribeToResponseOf('transaction.update.reply');
  //   await this.client.connect();
  // }

  @MessagePattern('transaction.update')
  async updateTransaction(@Payload() transaction_message: any) {
    console.log(
      '@EventPattern(transaction.validate.update)',
      transaction_message,
    );
  }

  @Post()
  create(@Body() body: any) {
    return this.transactionService.create(body);
  }

  @Put(':id')
  update(
    @Param('id')
    id: number,

    @Body()
    body: any,
  ) {
    return this.transactionService.update(id, body);
  }
}
