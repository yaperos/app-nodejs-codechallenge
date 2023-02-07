import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseTransactionCreate } from './interfaces/reponseType';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('createTransactionDb.reply')
  logReply(data: ResponseTransactionCreate[]): void {
    Logger.log(data);
  }

  @MessagePattern('createTransactionDb')
  createTransactionDb(data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }
}
