import { Body, Controller, Post, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../domain/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { ShowTransactionDto } from '../domain/show-transaction.dto';
import { EventPattern } from '@nestjs/microservices';
import { UpdateTransactionDto } from 'src/domain/update-transaction.dto';

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

  @EventPattern('update-transaction')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateTransaction(transaction: UpdateTransactionDto) {
    // validateTransaction(transaction: ShowTransactionDto) {
    console.log(`Received update-transaction event: ${transaction}`);
    console.log(transaction);
    await this.transactionService.update(transaction);

  }
}
