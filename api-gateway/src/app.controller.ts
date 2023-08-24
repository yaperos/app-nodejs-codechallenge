import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {
    return this.appService.createTransaction(createTransactionRequest);
  }
}
