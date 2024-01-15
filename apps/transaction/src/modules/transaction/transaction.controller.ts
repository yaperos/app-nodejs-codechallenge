import { UPDATE_TRANSACTION_TOPIC, UpdateTransactionDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @EventPattern(UPDATE_TRANSACTION_TOPIC)
  async updateTransactionEventHandler(
    @Payload() updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.transactionService.updateTransaction(updateTransactionDto);
  }
}
