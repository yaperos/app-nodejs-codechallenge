import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { TransactionStatus } from '../constants/enums';
import { UpdateTransactionStatusEvent } from '../contracts/types';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(process.env.APPROVE_TRANSACTION_EVENT)
  approveTransaction({ id }: UpdateTransactionStatusEvent): void {
    this.transactionService.updateTransactionStatus(
      id,
      TransactionStatus.APPROVED,
    );
  }

  @EventPattern(process.env.REJECT_TRANSACTION_EVENT)
  rejectTransaction({ id }: UpdateTransactionStatusEvent): void {
    this.transactionService.updateTransactionStatus(
      id,
      TransactionStatus.REJECTED,
    );
  }
}
