import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { TransactionTypeService } from '../services';

@Controller('api/transactions-type')
export class TransactionTypeController {
  constructor(private readonly transactionTypeSvc: TransactionTypeService) {}

  @Get()
  async getAllTransactionsType() {
    return this.transactionTypeSvc.getAllTransactionsType();
  }

  @Get(':id')
  async getTransactionType(@Param('id') id: number) {
    return this.transactionTypeSvc.getTransactionType(id);
  }

  @Post('create')
  newTransactionType(@Body() body: { typeName: string }) {
    return this.transactionTypeSvc.newTransactionType(body);
  }

  @Delete('clear')
  DeleteAllTypes() {
    return this.transactionTypeSvc.DeleteAllTypes();
  }
}
