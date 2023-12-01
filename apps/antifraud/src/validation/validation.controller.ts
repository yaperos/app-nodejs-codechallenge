import { Controller } from '@nestjs/common';
import { ValidationService } from './validation.service';
// import { FinancialTransaction } from '@transactions/transactions/entities/financial-transaction.entity';
import {
  FinancialTransactionCreatedPayload,
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
  async validate(
    @Payload() dto: FinancialTransactionCreatedPayload,
    @Ctx() context: KafkaContext,
  ) {
    console.log(KafkaTopics.FinancialTransactionCreated);
    console.log(dto);

    const payload: FinancialTransactionStatusUpdatedPayload =
      this.service.validate(dto);

    context.getProducer().send({
      topic: KafkaTopics.FinancialTransactionStatusUpdated,
      messages: [
        {
          key: crypto.randomUUID(),
          value: JSON.stringify(payload),
        },
      ],
    });

    return payload;
  }

  @EventPattern(KafkaTopics.FinancialTransactionStatusUpdated)
  async logStatusUpdated(@Payload() dto: FinancialTransactionCreatedPayload) {
    console.log(KafkaTopics.FinancialTransactionStatusUpdated);
    console.log(dto);
  }
}
