import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('transaction_created')
  validateTransactionCreated(@Payload() data: any) {
    return this.antiFraudService.validateTransaction(data);
  }
}
