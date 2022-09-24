import { TransactionStatus } from './transaction-status.enum';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transaction.service';
import { EventPattern } from '@nestjs/microservices';
import { AntiFraud } from './dto/anti-fraud.event';
import { Transaction } from './transaction.entity';
import { ApiOkResponse } from '@nestjs/swagger';
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @ApiOkResponse({
    description: 'The transaction record',
    type: Transaction,
  })
  @Get('/:id')
  getTransactionById(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.getTransaction(id);
  }

  @EventPattern('ANTIFRAUD.APPROVED.EVENT')
  async handleTransactionApproved(antifraud: AntiFraud) {
    console.log('TRANSACTION APROVED:  ', antifraud);
    const { transactionExternalId } = antifraud;
    const status = TransactionStatus.APPROVED;
    await this.transactionsService.updateTransaction({
      transactionExternalId,
      status,
    });
  }

  @EventPattern('ANTIFRAUD.REJECTED.EVENT')
  async handleTransactionRejected(antifraud: AntiFraud) {
    console.log('TRANSACTION REJECTED: ', antifraud);
    const { transactionExternalId } = antifraud;
    const status = TransactionStatus.REJECTED;
    await this.transactionsService.updateTransaction({
      transactionExternalId,
      status,
    });
  }
}
