import { Body, Controller, Get, Param, Post, ParseUUIDPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionResponseEntity } from './entities/transaction.response.entity';
import { IsNotEmpty } from 'class-validator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }




  @Post()
  @ApiBody({ type: TransactionEntity })
  @ApiCreatedResponse({ type: TransactionResponseEntity })
  create(@Body() createTransactionRequest: CreateTransactionRequest) {
    return this.transactionService.create(createTransactionRequest);
  }

  @Get(':id')
  @ApiOkResponse({ type: TransactionResponseEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.transactionService.findOne(id);
  }


}
