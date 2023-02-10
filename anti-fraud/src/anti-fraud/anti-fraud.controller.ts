import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { Transaction } from './models/transaction.model';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  public transactionCreated(data: Transaction) {
    this.antiFraudService.handleModeration(data);
  }
}
