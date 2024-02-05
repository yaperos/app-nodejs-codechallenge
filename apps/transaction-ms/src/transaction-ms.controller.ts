import { Controller, Get } from '@nestjs/common';
import { TransactionMsService } from './transaction-ms.service';

@Controller()
export class TransactionMsController {
  constructor(private readonly transactionMsService: TransactionMsService) {}

  @Get()
  getHello(): string {
    return this.transactionMsService.getHello();
  }
}
