import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UpdateTransactionStatusMessage } from '../contracts/types';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('antifraud')
  updateTransactionStatus(message: UpdateTransactionStatusMessage): void {
    this.transactionService.updateTransactionStatus(message);
  }
}
