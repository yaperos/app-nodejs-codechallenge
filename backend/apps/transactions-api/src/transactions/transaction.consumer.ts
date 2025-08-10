import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { TransactionValidatedDto } from "@shared/contracts";
import { commitOffset, Topics } from "@shared/messaging";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";

@Controller()
export class TransactionConsumer {
  constructor(private readonly transactionsService: TransactionsService) { }

  @EventPattern(Topics.TransactionValidated)
  async onValidated(@Payload() event: TransactionValidatedDto, @Ctx() context: KafkaContext): Promise<void> {
    await this.transactionsService.applyValidation(event);
    await commitOffset(context);
  }
}