import { Controller, ValidationPipe } from '@nestjs/common';
import { AntiFraudMsService } from './anti-fraud-ms.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IS_VALID_TRANSACTION_MESSAGE_PATTERN } from 'utils/utils/constants-global';

@Controller()
export class AntiFraudMsController {
  constructor(private readonly antiFraudMsService: AntiFraudMsService) {}

  @EventPattern(IS_VALID_TRANSACTION_MESSAGE_PATTERN)
  async handleTransactionValidate(@Payload(ValidationPipe) payload) {
    return this.antiFraudMsService.validate(payload);
  }
}
