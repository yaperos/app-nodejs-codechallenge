import { Controller } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { FinancialTransaction } from '@transactions/transactions/entities/financial-transaction.entity';
import {
  FinancialTransactionStatusUpdatedPayload,
  KafkaTopics,
} from '@transactions/utils/kafka-events.consts';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller('validations')
export class ValidationController {
  constructor(private service: ValidationService) {}

  @EventPattern(KafkaTopics.FinancialTransactionCreated)
  async validate(dto: FinancialTransaction, @Ctx() context: KafkaContext) {
    console.log(KafkaTopics.FinancialTransactionCreated);
    console.dir(dto);

    const payload: FinancialTransactionStatusUpdatedPayload =
      this.service.validate(dto);

    context.getProducer().send({
      topic: KafkaTopics.FinancialTransactionStatusUpdated,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });

    return payload;
  }

  @EventPattern(KafkaTopics.FinancialTransactionStatusUpdated)
  async logStatusUpdated(@Payload() dto: Record<string, unknown>) {
    console.log(KafkaTopics.FinancialTransactionStatusUpdated);
    console.dir(dto);
  }
}
