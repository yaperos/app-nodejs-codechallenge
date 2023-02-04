import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  // eslint-disable-next-line prettier/prettier
  ValidationPipe
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Statuses } from './statuses.enum';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions() {
    return this.transactionService.getTransactions();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    createTransactionDto.status = Statuses.PENDING;
    this.transactionService.createTransaction(createTransactionDto);
  }
}
