import { Controller, Logger } from '@nestjs/common';
import { MicroAntiFraudService } from './anti-fraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionMessage } from './entities/transaction.message';

@Controller()
export class MicroAntiFraudController {
  constructor(private readonly microAntiFraudService: MicroAntiFraudService) {}

  @MessagePattern('transaction.created')
  async validateTransactionAmount(@Payload() payload: TransactionMessage): Promise<void> {
    await this.microAntiFraudService.validateTransactionAmount(payload);
  }
}
