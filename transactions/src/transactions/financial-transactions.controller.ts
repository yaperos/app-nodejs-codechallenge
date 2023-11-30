import { Controller, Post, Get, Body } from '@nestjs/common';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { FinancialTransaction } from '@/transactions/interfaces/financial-transaction.interface';
import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';

@Controller('financial-transactions')
export class FinancialTransactionsController {
  constructor(private service: FinancialTransactionsService) {}

  @Post()
  async create(
    @Body() transaction: CreateFinancialTransactionDTO,
  ): Promise<CreateFinancialTransactionDTO> {
    return this.service.create(transaction);
  }

  @Get()
  async findAll(): Promise<FinancialTransaction[]> {
    return this.service.findAll();
  }
}
