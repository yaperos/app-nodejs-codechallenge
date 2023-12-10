import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @EventPattern('transaction_verified')
  verifyTransaction(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.updateStatus(updateTransactionDto);
  }
}
