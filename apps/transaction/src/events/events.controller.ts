import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_CHECKED_EVENT_TOPIC } from '../../../../libs/shared-constants';
import { TransactionService } from '../transaction.service';

@Controller()
export class EventsController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(TRANSACTION_CHECKED_EVENT_TOPIC)
  async handleTransactionChecked(@Payload() payload) {
    return this.transactionService.updateTransaction(payload);
  }
}
