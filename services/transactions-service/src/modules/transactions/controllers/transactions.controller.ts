import { Controller } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApproveTransactionDto } from '../dto/approve-transaction.dto';
import { RejectTransactionDto } from '../dto/reject-transaction.dto';
import { TransactionStatus } from '../constants/transaction-status.enum';
import { MicroservicesPatterns } from '@yape/microservices';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern(MicroservicesPatterns.TRANSACTION_CREATION)
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    await this.transactionsService.create(createTransactionDto);
  }

  @EventPattern(MicroservicesPatterns.TRANSACTION_REJECTED)
  async reject(@Payload() rejectTransactionDto: RejectTransactionDto) {
    const { transactionId: id } = rejectTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.REJECTED,
    });
  }

  @EventPattern(MicroservicesPatterns.TRANSACTION_APPROVED)
  async approve(@Payload() approveTransactionDto: ApproveTransactionDto) {
    const { transactionId: id } = approveTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.APPROVED,
    });
  }
}
