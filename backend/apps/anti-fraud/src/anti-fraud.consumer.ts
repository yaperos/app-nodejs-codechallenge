import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { TransactionCreatedDto } from "@shared/contracts/events/transaction-created";
import { commitOffset,Topics  } from "@shared/messaging";
import { AntiFraudService } from "apps/anti-fraud/src/anti-fraud.service";

@Controller()
export class AntiFraudConsumer {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(Topics.TransactionCreated)
  async onCreated(@Payload() event: TransactionCreatedDto, @Ctx() context: KafkaContext): Promise<void> {
    await this.antiFraudService.evaluateAndPublish(event.transactionExternalId, event.value);
    await commitOffset(context);
  }
}