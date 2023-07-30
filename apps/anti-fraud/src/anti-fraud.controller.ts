import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transactions')
  async verification(@Payload() message) {
    await this.antiFraudService.verification(
      message.transaction_external_id,
      message.value,
    );
  }
}
