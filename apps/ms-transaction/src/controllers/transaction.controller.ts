import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDto } from 'src/dtos/requests/create-transaction.dto';
import { TransactionStatusUpdateDto } from 'src/messages/transaction-status-update.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() request: CreateTransactionDto){
    return this.transactionService.createTransaction(request);
  }

  @MessagePattern('transactionStatusUpdate')
  async handleTransactionStatusUpdate(@Body() request: TransactionStatusUpdateDto){
    return this.transactionService.handleTransactionStatusUpdate(request);
  }
}
