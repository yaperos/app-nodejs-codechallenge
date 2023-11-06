import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionMessage } from '../models/validate-transaction-message.model';
import { QueryBus } from '@nestjs/cqrs';
import { ValidateTransactionQuery } from 'src/application/queries/validate-transaction.query';

@Controller()
export class KafkaServerController {
  constructor(private readonly queryBus: QueryBus) {}

  @EventPattern('transaction.validate')
  validateTransaction(@Payload() message: ValidateTransactionMessage) {
    this.queryBus.execute(
      new ValidateTransactionQuery(message.transactionId, message.value),
    );
  }
}
