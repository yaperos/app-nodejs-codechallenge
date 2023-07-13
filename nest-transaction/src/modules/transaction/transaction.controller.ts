import { ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ToMessageDto } from './utils/functions';
import { KafkaService } from '../kafka/kafka.service';
import { KAFKA_TOPIC_ANTIFRAUD_VALIDATION } from '../../app/kafka';

import { TransactionService } from './transaction.service';
import { ParseMongoIdPipe } from '../../common/parse-mongo-id.pipe';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionService.create(
      createTransactionDto,
    );
    if (!transaction) {
      throw new InternalServerErrorException('INTERNAL_ERROR');
    }

    const responseKafka = await this.kafkaService.antiFraudValidation(
      ToMessageDto(transaction),
    );
    Logger.log(responseKafka);

    return transaction;
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':transactionId')
  findOne(@Param('transactionId', ParseMongoIdPipe) transactionId: string) {
    return this.transactionService.findOne(transactionId);
  }

  @Delete(':transactionId')
  remove(@Param('transactionId', ParseMongoIdPipe) transactionId: string) {
    return this.transactionService.remove(transactionId);
  }
}
