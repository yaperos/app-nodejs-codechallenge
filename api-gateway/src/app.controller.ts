import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('transaction')
  createTransaction(
    @Body(ValidationPipe) createTransactionRequest: CreateTransactionRequest,
  ) {
    this.appService.createTransaction(createTransactionRequest);
  }

  @Get('transaction/:id')
  getTransaction(@Param() params) {
    return this.appService.getTransaction(params.id);
  }
}
