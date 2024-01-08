import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../services/transactions.service';
import { ValidateTransactionDto } from '../dto/validate-transaction.dto';
import { MicroservicesPatterns } from '@yape/microservices';

@Controller()
export class TransactionsController {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern(MicroservicesPatterns.TRANSACTION_CREATED)
  validate(@Payload() validateTransactionDto: ValidateTransactionDto) {
    return this.transactionsService.validate(validateTransactionDto);
  }
}
