import { TransactionCreatedEvent } from '@app/events/transaction/transaction-created';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transaction-created')
  verifyTransactionValue(@Payload() event: TransactionCreatedEvent): string {
    return this.antiFraudService.verify(event);
  }
}
