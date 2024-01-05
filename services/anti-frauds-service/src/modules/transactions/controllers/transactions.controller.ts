import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../services/transactions.service';
import { ValidateTransactionDto } from '../dto/validate-transaction.dto';

@Controller()
export class TransactionsController {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern('transaction_created')
  validate(@Payload() validateTransactionDto: ValidateTransactionDto) {
    this.logger.debug(`CORRIENDOOOOO`);
    return this.transactionsService.validate(validateTransactionDto);
  }
}
