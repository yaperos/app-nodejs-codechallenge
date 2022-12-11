import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { VerifyTransactionMessage } from './model/event/verify-transaction-message';

@Controller()
export class AntiFraudController {

  constructor(private readonly antiFraudService: AntiFraudService) {
}

  @MessagePattern('verify-transaction')
  validAntiFraud(@Payload() createAntiFraudDto: VerifyTransactionMessage) {
    return this.antiFraudService.applyAntiFraudValidation(createAntiFraudDto);
  }
}
