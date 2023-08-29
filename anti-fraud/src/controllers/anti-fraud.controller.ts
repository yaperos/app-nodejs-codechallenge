import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionDto } from 'src/dto/transaction.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('transaction_created')
  public transactionCreated(@Payload() payload: ValidateTransactionDto) {
    Logger.log(
      `INFO [transaction_created]: ${payload.transactionExternalId}  `,
      AntiFraudController.name,
    );

    this.transactionService.validate(payload);
  }
}
