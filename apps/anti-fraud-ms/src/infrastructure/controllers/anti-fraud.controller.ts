import { Controller } from '@nestjs/common';
import { AntiFraudService } from '../../domain/services/anti-fraud.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TRANSACTION_CREATED } from '@app/common/constants';
import { RequestData, TransactionEvent } from '@app/common/interfaces';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(TRANSACTION_CREATED)
  async handleCreatedTransactionEvent(
    @Payload() { payload }: RequestData<TransactionEvent>,
  ): Promise<void> {
    const validatedData =
      await this.antiFraudService.verifyTransaction(payload);

    await this.antiFraudService.emitValidatedTransactionNotification(
      validatedData,
    );
  }
}
