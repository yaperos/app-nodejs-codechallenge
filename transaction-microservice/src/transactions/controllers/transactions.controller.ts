import {
  Body,
  Controller,
  Put,
  Post,
  Param,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Get,
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
export class TransactionsController implements OnModuleInit {
  constructor(
    private transactionService: TransactionsService,

    @Inject('TRANSACTIONSERVICE')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['validate', 'response'].forEach((key) =>
      this.client.subscribeToResponseOf(`transaction.${key}`),
    );
  }

  // onModuleDestroy() {
  //   this.client.close();
  // }

  @MessagePattern('transaction.validate')
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

  @Get('find/:id')
  getOneByFindId(
    @Param('id')
    id: string,
  ) {
    return this.transactionService.getOne(id);
  }
}
