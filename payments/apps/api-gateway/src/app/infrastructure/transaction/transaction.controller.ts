import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto, TransactionPresenter } from '@payments/shared/dto';
import { lastValueFrom } from 'rxjs';

import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
    const createTransaction$ = this.appService.createTransaction(createTransactionDto);
    const transactionPresenter = await lastValueFrom(createTransaction$);
    if(!(transactionPresenter instanceof TransactionPresenter)){
      throw new BadRequestException(transactionPresenter);
    }
    return transactionPresenter;
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string){
      const getTransaction$ = this.appService.getTransaction(id);
      const transactionPresenter = await lastValueFrom(getTransaction$); 
      if(!(transactionPresenter instanceof TransactionPresenter)){
        throw new BadRequestException(transactionPresenter);
      }
      return transactionPresenter;
  }
}
