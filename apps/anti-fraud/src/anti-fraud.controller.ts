import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_CREATED_EVENT_TOPIC } from '../../../libs/shared-constants';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(TRANSACTION_CREATED_EVENT_TOPIC)
  async handleTransactionCreation(@Payload() payload) {
    return this.antiFraudService.validateTransaction(payload);
  }
}
