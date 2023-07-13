import { v4 as uuidv4 } from 'uuid';
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

import { KafkaService } from '../kafka/kafka.service';

import { TransactionService } from './transaction.service';
import { ParseMongoIdPipe } from '../../common/parse-mongo-id.pipe';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStateService } from './transaction.state.service';
import { ToMessageDto } from './utils/functions';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly transactionService: TransactionService,
    private readonly transactionStateService: TransactionStateService,
  ) {}

  @Delete('clean-up')
  async removeAll() {
    const transactions = await this.transactionService.findAll();
    await Promise.all(transactions.map(async (t) => await this.remove(t.id)));
    return true;
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const accountExternalIdDebit = uuidv4();
    const accountExternalIdCredit = uuidv4();
    const transaction = await this.transactionService.create(
      createTransactionDto,
      accountExternalIdDebit,
      accountExternalIdCredit,
    );
    if (!transaction) {
      throw new InternalServerErrorException('INTERNAL_ERROR');
    }

    await this.transactionStateService.create(
      transaction,
      'PAYMENT',
      'PENDING',
    );

    try {
      const responseKafka = await this.kafkaService.antiFraudValidation(
        ToMessageDto(transaction),
      );
      if (!!responseKafka.status?.length) {
        await this.transactionStateService.create(
          transaction,
          'PAYMENT',
          responseKafka.status,
        );
      }
    } catch (e) {
      Logger.log(e);
    }

    const status = await this.transactionStateService.findAll(transaction.id);
    return { ...transaction.toJSON(), status };
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
    this.transactionStateService.remove(transactionId);
    return this.transactionService.remove(transactionId);
  }
}
