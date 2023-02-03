import { Body, Controller, Post, Logger, Get, Param } from '@nestjs/common';
import { CreateTransactionDto } from '../domain/dto/create-transaction.dto';
import { TransactionService } from '../domain/transaction.service';
import { EventPattern } from '@nestjs/microservices';
import { UpdateTransactionDto } from '../domain/dto/update-transaction.dto';
import { GetTransactionDto } from '../domain/dto/get-transaction.dto';
import { ShowTransactionDto } from '../domain/dto/show-transaction.dto';

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

  @Get(':transactionExternalId')
  getTransaction(
    @Param() getTransactionDto: GetTransactionDto,
  ): Promise<ShowTransactionDto> {
    this.logger.log({
      params: getTransactionDto,
    });
    return this.transactionService.getOne(
      getTransactionDto.transactionExternalId,
    );
  }
}
