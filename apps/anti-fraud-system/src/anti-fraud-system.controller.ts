import { Controller } from '@nestjs/common';
import { AntiFraudSystemService } from './anti-fraud-system.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InputTransactionEvent } from './dto/input-transaction-events-dtos';

@Controller()
export class AntiFraudSystemController {
  constructor(
    private readonly antiFraudSystemService: AntiFraudSystemService,
  ) {}

  @MessagePattern('transaction.created')
  validateTransactionCreated(@Payload() message: InputTransactionEvent) {
    this.antiFraudSystemService.validateTransaction(message);
  }
}
