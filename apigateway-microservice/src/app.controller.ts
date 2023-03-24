import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './dto/create-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createOrder(@Body() createtransactionDto: CreateTransactionRequest) {
    return await  this.appService.createTransaction(createtransactionDto);
  }
}
