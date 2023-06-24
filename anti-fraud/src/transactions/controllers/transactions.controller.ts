import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Transaction } from '../contracts/types';
import { TransactionsService } from '../services/transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('transactions')
  validateTransaction(@Payload() message: Transaction): void {
    this.transactionsService.sendValidationStatusMessage(message);
  }
}
