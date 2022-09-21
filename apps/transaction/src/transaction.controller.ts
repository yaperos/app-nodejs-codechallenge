import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getHello(): string {
    return this.transactionService.getHello();
  }

  @Post()
  createPhoto(@Body() body: any): Promise<any> {
    return this.transactionService.create(body);
  }
}
