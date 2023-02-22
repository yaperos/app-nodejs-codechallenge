import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  createTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {
    return this.appService.createTransaction(createTransactionRequest);
  }
}
