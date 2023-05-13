import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SaveTransactionRequest, UpdateTransactionRequest } from './dto';
import { Transaction } from 'src/entities';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  get(): Promise<Transaction[]> {
    return this.transactionService.getTransactions();
  }

  @Get('/:id')
  getId(@Param('id') id: string): Promise<Transaction[]> {
    return this.transactionService.getTransaction(id);
  }

  @Post('/save')
  save(
    @Body() saveTransactionRequest: SaveTransactionRequest,
  ): Promise<Transaction> {
    return this.transactionService.save(saveTransactionRequest);
  }

  @Post('/update')
  update(
    @Body() updateTransactionRequest: UpdateTransactionRequest,
  ): Promise<Transaction> {
    return this.transactionService.update(updateTransactionRequest);
  }
}
