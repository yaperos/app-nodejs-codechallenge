import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dtos/transaction.dto';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({ type: [TransactionDto] })
  async findAll(@Query() query: FilterQuery<TransactionDto>) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: TransactionDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string) {
    return this.transactionsService.findById(id);
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

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
