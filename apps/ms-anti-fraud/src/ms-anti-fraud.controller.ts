import { Controller } from '@nestjs/common';
import { MsAntiFraudService } from './ms-anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionPayload } from './interfaces/transaction.interface';
import { ANTI_FRAUD_GET_TOPIC } from './constants/topics';

@Controller()
export class MsAntiFraudController {
  constructor(private readonly msAntiFraudService: MsAntiFraudService) {}

  @EventPattern(ANTI_FRAUD_GET_TOPIC)
  async validateAntiFraud(
    @Payload() message: TransactionPayload,
  ): Promise<void> {
    this.msAntiFraudService.validateAntiFraud(message);
  }
}
