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

  @Get()
  getHello(): string {
    return this.antiFraudService.getHello();
  }

  @EventPattern('transaction_created')
  async handleTransactionCreated(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ) {
    this.antiFraudService.check(data);
  }
}
