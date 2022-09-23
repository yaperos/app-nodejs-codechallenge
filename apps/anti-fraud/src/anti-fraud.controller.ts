import { START_TRANSACTION_VALIDATED } from '@app/common/constans/topics';
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

  @EventPattern(START_TRANSACTION_VALIDATED)
  async handleTransactionCreated(
    @Payload() { payload }: RequestData<AntiFraud>,
    @Ctx() context: KafkaContext,
  ) {
    const validatedData = await this.antiFraudService.check(payload);
    await this.antiFraudService.emitResultValidated(validatedData);
  }
}
