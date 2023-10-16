import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}
  @EventPattern('topic.transaction.yape')
  async updateStatusTransaction(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const originalMessage = context.getMessage();
    console.log(originalMessage.value)
    await this._transactionService.updateStatusTransaction(
      originalMessage.value,
    );
  }
}
