import { AntiFraud, RequestData } from '@app/common/interfaces';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern('start_transaction_validated')
  async handleTransactionCreated(
    @Payload() { payload }: RequestData<AntiFraud>,
    @Ctx() context: KafkaContext,
  ) {
    const validatedData = await this.antiFraudService.check(payload);
    await this.antiFraudService.emitResultValidated(validatedData);
  }
}
