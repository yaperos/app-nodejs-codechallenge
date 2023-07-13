import { ApiTags } from '@nestjs/swagger';
import { Get, Post, Body, Param, Delete, Controller } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { ParseMongoIdPipe } from '../../common/parse-mongo-id.pipe';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':transactionId')
  findOne(@Param('transactionId', ParseMongoIdPipe) transactionId: string) {
    return this.transactionService.findOne(transactionId);
  }

  @Delete(':transactionId')
  remove(@Param('transactionId', ParseMongoIdPipe) transactionId: string) {
    return this.transactionService.remove(transactionId);
  }
}
