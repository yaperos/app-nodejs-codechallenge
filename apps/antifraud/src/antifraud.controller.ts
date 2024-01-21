import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionToValidate } from './dto/transaction-to-validate.dto';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern('transaction_created')
  transactionValidator(@Payload() data: TransactionToValidate) {
    this.antifraudService.transactionValidator(data);
  }
}
