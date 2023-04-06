import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dtos/transaction.dto';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { Events } from './types/transaction-types-enums';
import { EventPattern } from '@nestjs/microservices';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({ type: [TransactionDto] })
  async findAll(@Query() query: FilterQuery<TransactionDto>) {
    return this.transactionsService.findAll(query);
  }

  @Post()
  @ApiOkResponse({ type: TransactionDto })
  @ApiBadRequestResponse()
  async create(@Body() createDto: CreateTransactionDto) {
    return this.transactionsService.create(createDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TransactionDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(@Param('id') id: string, @Body() updateDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateDto);
  }
}
