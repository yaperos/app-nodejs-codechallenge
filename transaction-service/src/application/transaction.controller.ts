import { Body, Controller, Post, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../domain/create-transaction.dto';
import { Transaction } from 'src/domain/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) { }

  @Post('add')
  createTransaction(
    @Body() transaction: CreateTransactionDto,
  ): Promise<Transaction> {
    this.logger.log({
      bodyParams: transaction,
    });
    return this.transactionService.add(transaction);
  }
}
