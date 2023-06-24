import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './event/transaction-created-event';

@Controller()
export class AntiFraudController {
  constructor(private readonly appService: AntiFraudService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(data: TransactionCreatedEvent) {
    this.appService.handleTransactionCreated(data);
  }
}
