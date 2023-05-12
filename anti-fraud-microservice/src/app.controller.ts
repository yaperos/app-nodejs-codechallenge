import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudDecision, Transaction } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction_save')
  evaluateTransaction(
    @Payload(ValidationPipe) transaction: Transaction,
  ): string {
    return this.appService.evaluateTransaction(transaction);
  }
}
