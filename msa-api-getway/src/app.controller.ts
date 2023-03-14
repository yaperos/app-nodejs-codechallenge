import { Body, Controller, Get, Post,Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './create-transaction-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post()
  createTransaction(@Body() createTransactionRequest:CreateTransactionRequest){
    //Logger.log(`entrando ${JSON.stringify(createTransactionRequest)}`)
    this.appService.createTransaction(createTransactionRequest);
  }
}
