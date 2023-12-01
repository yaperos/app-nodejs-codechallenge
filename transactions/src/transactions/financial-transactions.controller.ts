import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';
import { ReadFinancialTransactionDTO } from '@/transactions/dto/read-financial-transaction.dto';
import { FinancialTransactionDTOBuilder } from '@/transactions/builders/financial-transaction.dto.builder';
import { FinancialTransactionBuilder } from '@/transactions/builders/financial-transaction.builder';

@Controller('financial-transactions')
export class FinancialTransactionsController {
  constructor(private service: FinancialTransactionsService) {}

  @Post()
  async create(@Body() dto: CreateFinancialTransactionDTO): Promise<number> {
    let entity = FinancialTransactionBuilder.fromCreateDTO(dto);
    entity = await this.service.create(entity);

    return entity.transactionId;
  }

  @Get()
  async findAll(): Promise<ReadFinancialTransactionDTO[]> {
    const entities = await this.service.findAll();
    return FinancialTransactionDTOBuilder.fromEntities(entities);
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ReadFinancialTransactionDTO> {
    const entity = await this.service.getOne(id);
    return FinancialTransactionDTOBuilder.fromEntity(entity);
  }
}
