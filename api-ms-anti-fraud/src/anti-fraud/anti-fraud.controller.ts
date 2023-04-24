import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ITransaction } from './interfaces/transaction.interface';
import {
  EVENT_TRANSACTION_FAILED,
  EVENT_TRANSACTION_SUCCESS,
  EVENT_TRANSACTION_VALIDATE,
} from '../constants';

@Controller('anti-fraud')
export class AntiFraudController implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_PACKAGE') private readonly client: ClientKafka,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(EVENT_TRANSACTION_SUCCESS);
    this.client.subscribeToResponseOf(EVENT_TRANSACTION_FAILED);
  }

  @MessagePattern(EVENT_TRANSACTION_VALIDATE)
  validateTransaction(@Payload() data: ITransaction) {
    Logger.log(`Validating transaction: ${JSON.stringify(data)}`);
    const { id, value } = data;
    const isFraud = value > 1000;
    console.log('isFraud', isFraud);
    
    if (isFraud) {
      return this.client.emit(EVENT_TRANSACTION_FAILED, { id });
    }
    return this.client.emit(EVENT_TRANSACTION_SUCCESS, { id });
  }
}
