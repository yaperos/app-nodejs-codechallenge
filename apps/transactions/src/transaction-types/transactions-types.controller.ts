import { Controller, Post, Get, Body } from '@nestjs/common';
import { TransactionTypesService } from './transactions-types.service';
import { FinancialTransactionType } from '@transactions/transactions/entities/financial-transaction-type.entity';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('transaction-types')
export class TransactionTypesController {
  constructor(private service: TransactionTypesService) {}

  @Post()
  async create(
    @Body() dto: Partial<FinancialTransactionType>,
  ): Promise<number> {
    const entity = await this.service.create(dto);

    return entity.transactionTypeId;
  }

  @Get()
  async findAll(): Promise<FinancialTransactionType[]> {
    return await this.service.findAll();
  }
}
