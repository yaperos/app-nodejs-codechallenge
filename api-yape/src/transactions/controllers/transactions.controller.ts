import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Controller('api/v1')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/transactions')
  createTransaction(@Body() createServiceDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createServiceDto);
  }

  /*
   The basis of the following operations is provided for possible future implementations
  */
 
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
