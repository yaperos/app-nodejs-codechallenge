import {Body, Controller, Get, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {CreateTransactionDto} from "./dtos/create.transaction";

@Controller('transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Get(':transactionId')
  async findOneTransaction(@Param('transactionId', ParseUUIDPipe) transactionId: string) {
    return this._transactionService.findOne(transactionId);
  }

  @Post()
  async createTransaction(@Body() createTransactionInput: CreateTransactionDto) {
    return this._transactionService.create(createTransactionInput);
  }
}
