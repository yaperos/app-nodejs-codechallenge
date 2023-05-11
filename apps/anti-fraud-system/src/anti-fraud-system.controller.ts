import { Controller, Get } from '@nestjs/common';
import { AntiFraudSystemService } from './anti-fraud-system.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntiFraudSystemController {
  constructor(
    private readonly antiFraudSystemService: AntiFraudSystemService,
  ) {}

  @MessagePattern('transaction.created')
  validateTransactionCreated(@Payload() message: any) {
    this.antiFraudSystemService.validateTransaction(message);
  }
}
