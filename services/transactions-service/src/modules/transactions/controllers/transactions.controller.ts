import { Controller } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionStatus } from '../constants/transaction-status.enum';
import {
  MicroservicesPatterns,
  TransactionApprovedMessageSchema,
  TransactionCreationMessageSchema,
  TransactionRejectedMessageSchema,
} from '@yape/microservices';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern(MicroservicesPatterns.TRANSACTION_CREATION)
  async create(
    @Payload() createTransactionDto: TransactionCreationMessageSchema,
  ) {
    await this.transactionsService.create(createTransactionDto);
  }

  @EventPattern(MicroservicesPatterns.TRANSACTION_REJECTED)
  async reject(
    @Payload() rejectTransactionDto: TransactionRejectedMessageSchema,
  ) {
    const { transactionId: id } = rejectTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.REJECTED,
    });
  }

  @EventPattern(MicroservicesPatterns.TRANSACTION_APPROVED)
  async approve(
    @Payload() approveTransactionDto: TransactionApprovedMessageSchema,
  ) {
    const { transactionId: id } = approveTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.APPROVED,
    });
  }
}
