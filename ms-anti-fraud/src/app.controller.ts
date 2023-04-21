import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TRANSACTION_STATUS } from './constants/transaction-status.enum';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction_created')
  handleTransactionCreated(amount: number): number {
    return (amount > 1000) ? TRANSACTION_STATUS.REJECTED : TRANSACTION_STATUS.APPROVED;
  }
}
