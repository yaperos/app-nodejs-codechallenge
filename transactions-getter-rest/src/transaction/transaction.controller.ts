import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionOutput, TransactionsOutput } from './dto/transaction.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('/transaction/:id')
  @ApiResponse({
    status: 200,
    type: TransactionOutput,
    description: 'get transaction',
  })
  getTransaction(@Param('id') id: string): Promise<TransactionOutput> {
    return this.service.getTransaction(id);
  }

  @Get('/transactions')
  @ApiResponse({
    status: 200,
    type: TransactionsOutput,
    description: 'find transactions',
  })
  getTransactions(
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ): Promise<TransactionsOutput> {
    return this.service.getTransactions(page, pageSize);
  }
}
