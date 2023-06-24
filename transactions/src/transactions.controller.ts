import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionStatusEvent } from './event/update-transaction-status-event';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly appService: TransactionsService) {}

  @Post()
  createTransaction(@Body() body: CreateTransactionRequestDto) {
    return this.appService.createTransaction(body);
  }

  @Get()
  retrieveAllTransactions() {
    return this.appService.retrieveAllTransactions();
  }

  @Get(':id')
  retrieveTransaction(@Param('id') id: string): Promise<TransactionDto> {
    return this.appService.retrieveTransaction(id);
  }

  @EventPattern('update_transaction_status')
  handleUpdateTransactionStatus(data: UpdateTransactionStatusEvent) {
    return this.appService.updateTransactionStatus(data);
  }
}
