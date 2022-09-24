import { AntiFraudService } from './anti-fraud.service';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Transaction } from './dto/transaction-created.event';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('TRANSACTION.CREATED.EVENT')
  async handleTransactionCreated(transaction: Transaction) {
    console.log('TRANSACTION CREATED: ', transaction);
    await this.antiFraudService.createAntiFraud(transaction);
  }
}
