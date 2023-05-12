import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SaveTransactionRequest, UpdateTransactionRequest } from './dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  get() {
    return this.transactionService.getTransactions();
  }

  @Get('/:id')
  getId(@Param('id') id: string) {
    return this.transactionService.getTransaction(id);
  }

  @Post('/save')
  save(@Body() saveTransactionRequest: SaveTransactionRequest) {
    return this.transactionService.save(saveTransactionRequest);
  }

  @Post('/update')
  update(@Body() updateTransactionRequest: UpdateTransactionRequest) {
    return this.transactionService.update(updateTransactionRequest);
  }
}
