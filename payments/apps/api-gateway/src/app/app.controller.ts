import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransactionDto } from '@payments/shared/dto';
import { lastValueFrom } from 'rxjs';

import { AppService } from './app.service';

@Controller('transaction')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
    const createTransaction$ = this.appService.createTransaction(createTransactionDto);
    const transactionPresenter = await lastValueFrom(createTransaction$);
    return transactionPresenter;
  }
}
