import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<any> {

    return this.transactionService.create(createTransactionDto);
  }

  @Get(':transactionExternalId')
  async findOne(@Param('transactionExternalId') transactionExternalId: string): Promise<any> {
    return this.transactionService.findOneByTransactionExternalId(transactionExternalId);
  }
}
