import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Transaction } from '../contracts/types';
import { TransactionsService } from '../services/transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern(process.env.TRANSACTION_CREATE_EVENT)
  validateTransaction(@Payload() message: Transaction): void {
    this.transactionsService.sendValidationStatusMessage(message);
  }
}
