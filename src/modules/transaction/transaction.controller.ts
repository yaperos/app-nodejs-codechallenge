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

@Controller('transaction')
export class TransactionController {
  constructor(
    private service: TransactionService,
    @Inject('YAPE')
    private readonly kafka: ClientProxy,
  ) {}

  @Post('/')
  public async create(
    @Body() transactions: CreateTransactionDto[],
  ): Promise<ITransactionResponse[]> {
    const transaction = await this.service.createTransanction(transactions);
    this.emitMessageTransaction(transaction);
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

  @MessagePattern('Anti-Fraud')
  public async messageTransaction(
    @Payload() payload: MessageKafkaPayloadDto[],
  ) {
    const response = await this.service.updateTransaction(payload);
    Logger.log('Verified transactions', JSON.stringify(response));
    this.emitMessage(response);
  }

  @MessagePattern('Transaction')
  public async transaction(@Payload() payload: MessageKafkaPayloadDto[]) {
    Logger.log('Transaction finish process', JSON.stringify(payload));
  }

  private emitMessage(transaction: ITransactionResponse[]) {
    this.kafka.emit('Transaction', JSON.stringify(transaction));
  }

  private emitMessageTransaction(transaction: ITransactionResponse[]) {
    this.kafka.emit('Anti-Fraud', JSON.stringify(transaction));
  }
}
