import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionService } from '../application/create-transaction.service';
import { FindTransactionService } from '../application/find-transaction.service';
import { CreateTransactionRequestDto } from '../domain/dtos/create-transaction-request.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly findTransactionService: FindTransactionService,
  ) {}

  @Post()
  createTransaction(@Body() request: CreateTransactionRequestDto) {
    return this.createTransactionService.execute(request);
  }

  @Get(':id')
  findTransaction(@Param('id') id: string) {
    return this.findTransactionService.execute(id);
  }
}
