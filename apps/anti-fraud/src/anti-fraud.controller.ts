import { Controller, Get } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(@Payload() message: any) {
    const transactionData = message.value ? message.value : message;
    this.antiFraudService.handleTransactionValidation(transactionData);
  }
}
