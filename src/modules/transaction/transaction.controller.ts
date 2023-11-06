import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { MessageKafkaPayloadDto } from './dtos/message-kafka.dto';
import { ITransactionResponse } from './interfaces/transaction.interface';
import { AntiFraud } from '../anti-fraud/anti-fraud';

@Controller('transaction')
export class TransactionController {
  constructor(
    private service: TransactionService,
    private readonly antiFraudProvide: AntiFraud,
  ) {}

  @Post('/')
  public async create(
    @Body() transactions: CreateTransactionDto[],
  ): Promise<ITransactionResponse[]> {
    const transaction = await this.service.createTransanction(transactions);
    this.antiFraudProvide.emitMessageTransaction(transaction);
    return transaction;
  }

  @Get('/')
  public async getAllTransaction() {
    return await this.service.getAllTransaction();
  }

  @Get('/:transactionId')
  public async getTransaction(@Param('transactionId') transactionId: string) {
    return await this.service.getTransaction(transactionId);
  }
}
