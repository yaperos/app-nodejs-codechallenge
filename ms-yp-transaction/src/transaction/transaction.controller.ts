import { Controller, Post, Body, Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

import { createTransactionEvent } from '../utils/createdTransactionEvent';
import { TransactionUpdated } from '../interfaz/transaction.interfaz';
import {
  TRANSACTION_CREATED,
  UPDATED_TRANSACTION_STATUS_TOPIC,
} from '../constants/common';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('ANTIFRAUD_SERVICE')
    private readonly tranasctionClient: ClientKafka,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const trasactionCreated =
      await this.transactionService.create(createTransactionDto);
    this.tranasctionClient.emit(
      TRANSACTION_CREATED,
      createTransactionEvent(trasactionCreated),
    );
    return trasactionCreated;
  }

  @EventPattern(UPDATED_TRANSACTION_STATUS_TOPIC)
  async handleUpdatedTransactionStatus(payload: TransactionUpdated) {
    const { id, transactionStatus } = payload;
    await this.transactionService.update(id, transactionStatus);
  }
}
