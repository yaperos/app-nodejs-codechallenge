import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MsTransactionService } from './ms-transaction.service';
import { TransactionStatus } from './Interfaces/transaction,interface';
import { ANTI_FRAUD_RESOLVED_TOPIC } from './constants/topics';

@Controller()
export class MsTransactionAsyncController {
  constructor(private readonly msTransactionService: MsTransactionService) {}

  @EventPattern(ANTI_FRAUD_RESOLVED_TOPIC)
  async updateTransactionStatus(
    @Payload() message: TransactionStatus,
  ): Promise<void> {
    await this.msTransactionService.updateTransaction(message);
  }
}
