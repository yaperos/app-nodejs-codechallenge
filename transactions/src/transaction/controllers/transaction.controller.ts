import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { UpdateTransactionStatusMessage } from '../contracts/types';
import { TransactionService } from '../services/transaction.service';
import { TransactionStatus } from '../constants/enums';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(process.env.APPROVE_TRANSACTION_EVENT)
  approveTransaction(message: UpdateTransactionStatusMessage): void {
    this.transactionService.updateTransactionStatus(
      message,
      TransactionStatus.APPROVED,
    );
  }

  @EventPattern(process.env.REJECT_TRANSACTION_EVENT)
  rejectTransaction(message: UpdateTransactionStatusMessage): void {
    this.transactionService.updateTransactionStatus(
      message,
      TransactionStatus.REJECTED,
    );
  }
}
