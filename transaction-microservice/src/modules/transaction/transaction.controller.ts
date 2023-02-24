import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  TransactionPattern,
  ValidateTransactionDto,
} from './transaction.types';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern(TransactionPattern.CREATE_TRANSACTION)
  createTransaction(data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }

  @EventPattern(TransactionPattern.VALIDATE_TRANSACTION)
  validateTransaction(data: ValidateTransactionDto) {
    return this.transactionService.validateTransaction(data);
  }
}
