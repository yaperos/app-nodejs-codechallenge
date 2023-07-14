import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TransactionCreatedDto } from './transaction-created.dto';
import { ValidateTransactionService } from '../../../application/services/validate-transaction.service';

@Controller()
export class TransactionCreatedListener {
  private readonly logger: Logger = new Logger(TransactionCreatedListener.name);

  constructor(private readonly service: ValidateTransactionService) {}

  @EventPattern('transaction-created')
  handler(
    @Payload() data: TransactionCreatedDto,
    @Ctx() context: KafkaContext,
  ): void {
    this.logger.log(context.getTopic(), JSON.stringify(data));
    this.service.validate(data.transactionExternalId, data.value);
  }
}
