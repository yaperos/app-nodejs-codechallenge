import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transaction-created')
  verifyTransaction(@Payload() transactionValue): string {
    this.logger.debug('verification request received', transactionValue);
    return this.antiFraudService.verify(transactionValue);
  }
}
