import { Body, Controller, Post, Get, ValidationPipe, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  createTransaction(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto
  ) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    console.log("Trying to get the transaction")
    return this.transactionService.getTransactionById(id);
  }
}
