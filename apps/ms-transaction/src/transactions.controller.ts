import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @EventPattern('transaction_reject')
  transactionReject(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.updateStatus(updateTransactionDto);
  }

  @EventPattern('transaction_approved')
  transactionApproved(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.updateStatus(updateTransactionDto);
  }
}
