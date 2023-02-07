import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject('ANTIFRAUDSERVICE')
    private readonly client: ClientKafka,
  ) {}

  @MessagePattern('transaction.validate')
  public transactionValidate(
    @Payload()
    transaction: any,
  ) {
    const { transactionId, transactionAmount } = transaction;
    const valid = this.appService.validate(transactionAmount);
    this.transactionValidation(transactionId, valid);
  }

  async transactionValidation(id: string, status: string) {
    console.log('RPTA de la validaciones', {
      transactionId: id,
      transactionStatus: status,
    });

    this.client.emit('transaction.update', {
      transactionId: id,
      transactionStatus: status,
    });
  }
}
