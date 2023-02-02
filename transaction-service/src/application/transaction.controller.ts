import { Body, Controller, Post, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../domain/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { ShowTransactionDto } from '../domain/show-transaction.dto';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) { }

  @Post('add')
  createTransaction(
    @Body() transaction: CreateTransactionDto,
  ): Promise<ShowTransactionDto> {
    this.logger.log({
      bodyParams: transaction,
    });
    return this.transactionService.add(transaction);
  }
}
