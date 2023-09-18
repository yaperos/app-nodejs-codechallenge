import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreationTransactionService } from '../services/creationTransaction.service';
import { GettingTransactionService } from '../services/gettingTransaction.service';
import { CreateTransactionDto } from '../dto/create_transaction.dto';
import { ResponseGetTransactionDto } from '../dto/response_get_transaction.dto';
import { ResponseErrorInterface } from 'src/../start/interfaces/responseError.interface';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly creationTransactionService: CreationTransactionService,
    private readonly gettingTransactionService: GettingTransactionService,
  ) {}

  @Post()
  createTransaction(@Body() payload: CreateTransactionDto) {
    return this.creationTransactionService.runCreateTransaction(payload);
  }

  @Get(':transactionExternalId')
  async getTransaction(
    @Param('transactionExternalId') transactionExternalId: string,
  ): Promise<ResponseGetTransactionDto | ResponseErrorInterface> {
    console.log('transactionExternalId', transactionExternalId);
    return this.gettingTransactionService.getTransaction(transactionExternalId);
  }
}
