import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionValidatedEvent } from '../../domain/events/transaction-validated.event';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

@Injectable()
export class ValidateTransactionService {
  private readonly logger: Logger = new Logger(ValidateTransactionService.name);

  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  validate(transactionExternalId: string, value: number) {
    const transaction = TransactionEntity.create(transactionExternalId, value);
    const event = new TransactionValidatedEvent(transaction);
    this.clientKafka.emit(event.eventName, event.toString());
    this.logger.log(event.toString());
  }
}
