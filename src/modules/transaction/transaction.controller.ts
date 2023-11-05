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
  ): Promise<any> {
    const transaction = await this.service.createTransanction(transactions);
    this.kafka.emit('Anti-Fraud', JSON.stringify(transaction));
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
    Logger.log(
      'Payload que regresa cuando se consume la cola',
      JSON.stringify(payload),
    );
    const response = await this.service.updateTransaction(payload);
    Logger.log('message', JSON.stringify(response));
  }
}
