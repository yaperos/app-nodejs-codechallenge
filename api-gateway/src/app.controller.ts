import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './requests/create-transaction-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {
    this.appService.createTransaction(createTransactionRequest)
  }
}
