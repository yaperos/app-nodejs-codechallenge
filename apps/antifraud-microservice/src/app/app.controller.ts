import { Controller, Get, ValidationPipe } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('antifraud.evalue')
  handleUserCreate(@Payload(ValidationPipe) transaction: Transaction) {
    return this.appService.evalueTransaction(transaction);
  }
}
