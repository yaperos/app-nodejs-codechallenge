import { Controller, Get, Inject, ValidationPipe } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from '@app-nodejs-codechallenge/shared/dto';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) { }

  @MessagePattern('transaction.create')
  async handleTransactionCreate(@Payload(ValidationPipe) data: CreateTransactionDto) {
    const response = await this.appService.createTransaction(data);
    return JSON.stringify(response);
  }

  @MessagePattern('transaction.update')
  async handleTransactionUpdate(@Payload(ValidationPipe) data: Transaction) {
    const response = await this.appService.updateTransaction(data);
    return JSON.stringify(response);
  }
}
