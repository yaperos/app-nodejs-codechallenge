import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequest } from './transaction/dto/create-transaction-request.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello Transaction Server!'
  }
}
