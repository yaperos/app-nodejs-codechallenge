import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionProducerService } from './Transaction/TransactionProducerService';
import { TransactionInputDto } from './dtos/TransactionInputDto';

@Controller()
export class AppController {
  constructor(private readonly appService: TransactionProducerService) {}

  @Post()
  Transaction(@Body() transaction: TransactionInputDto): Promise<string> {
    return this.appService.saveTransaction(transaction);
  }
}
