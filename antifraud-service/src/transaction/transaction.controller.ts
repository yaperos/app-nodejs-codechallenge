import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @EventPattern('transaction-to-verify')
  handle(@Payload() transaction: TransactionDto) {
    return this.service.validateTransaction(transaction);
  }
}
