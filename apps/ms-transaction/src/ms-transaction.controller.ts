import { Controller, Get } from '@nestjs/common';
import { MsTransactionService } from './ms-transaction.service';

@Controller()
export class MsTransactionController {
  constructor(private readonly msTransactionService: MsTransactionService) {}

  @Get()
  getHello(): string {
    return this.msTransactionService.getHello();
  }
}
