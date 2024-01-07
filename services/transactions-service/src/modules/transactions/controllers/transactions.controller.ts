import { Controller } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApproveTransactionDto } from '../dto/approve-transaction.dto';
import { RejectTransactionDto } from '../dto/reject-transaction.dto';
import { TransactionStatus } from '../constants/transaction-status.enum';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern('transaction.creation')
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    await this.transactionsService.create(createTransactionDto);
  }

  @EventPattern('transaction.rejected')
  async reject(@Payload() rejectTransactionDto: RejectTransactionDto) {
    const { transactionId: id } = rejectTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.REJECTED,
    });
  }

  @EventPattern('transaction.approved')
  async approve(@Payload() approveTransactionDto: ApproveTransactionDto) {
    const { transactionId: id } = approveTransactionDto;

    await this.transactionsService.update(id, {
      status: TransactionStatus.APPROVED,
    });
  }
}
