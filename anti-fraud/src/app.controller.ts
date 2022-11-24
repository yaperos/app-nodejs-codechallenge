import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { TransactionValidatedEvent } from './transactionEvent';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('antiFraud')
  handleantiFraud(data: TransactionValidatedEvent): any {
    return {eventStatus: this.appService.handleTrasactionCreated(data)};
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}