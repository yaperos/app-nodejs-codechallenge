import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionResponse } from '../interfaces/transaction';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('createTransaction.reply')
  logReply(data: TransactionResponse[]): void {
    Logger.log(data);
  }

  @MessagePattern('createTransaction')
  createTransaction(data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }
}
