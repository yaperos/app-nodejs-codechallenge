import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction.validate')
  public transactionValidate(transaction: any) {
    const { transactionId, transactionAmount } = transaction;
    const valid = this.appService.validate(transactionAmount);
    this.transactionValidation(transactionId, valid);
  }

  async transactionValidation(id: string, status: string) {
    console.log('RPTA', {
      transactionId: id,
      transactionStatus: status,
    });
    return {
      transactionId: id,
      transactionStatus: status,
    };
  }
}
