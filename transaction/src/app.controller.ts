import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  EventPattern,
  Payload,
} from '@nestjs/microservices';
import { TransactionsService } from './transactions/transactions.service';

@Controller()
export class AppController {
  constructor(
    private readonly transactionService: TransactionsService,
  ) { }

  @EventPattern(process.env.APPROVED_TOPIC)
  async readApprovedMessages(@Payload() message: any, @Ctx() context: KafkaContext) {
    const log_info =
      `Receiving a new message from topic: ` + process.env.APPROVED_TOPIC +
      JSON.stringify(message);
    console.log(log_info)
    this.transactionService.approve(message)
  }

  @EventPattern(process.env.REJECTED_TOPIC)
  async readRejectedMessages(@Payload() message: any, @Ctx() context: KafkaContext) {
    const log_info =
      `Receiving a new message from topic: ` + process.env.REJECTED_TOPIC +
      JSON.stringify(message);
    console.log(log_info)
    this.transactionService.reject(message)
  }
}
