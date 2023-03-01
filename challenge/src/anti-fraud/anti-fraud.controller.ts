import {
  Controller,
  Inject,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { TransactionStatusEnum } from 'src/shared/enums/transaction-status.enum';
import {
  TRANSACTION_CREATED,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_STATUS_REJECTED,
} from 'src/shared/events';
import { NewTransactionEvent } from './events/new-transaction.event';
import { TransactionStatusChangeEvent } from './events/transaction-status-change.event';

@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  @EventPattern(TRANSACTION_CREATED)
  async handlerTransactionCreated(@Payload() event: NewTransactionEvent) {
    const { transactionValue, transactionExternalId } = event;
    this.logger.log(
      `transaction ${transactionExternalId} with value = ${transactionValue} received`,
    );

    if (transactionValue > 1000 || transactionValue < 0) {
      this.logger.log(`transaction (${transactionExternalId}) invalid`);
      const responseEvent = new TransactionStatusChangeEvent(
        TransactionStatusEnum.REJECTED,
        transactionExternalId,
      );

      this.clientKafka.emit(TRANSACTION_STATUS_REJECTED, responseEvent);
    } else {
      this.logger.log(`transaction (${transactionExternalId}) valid`);
      const responseEvent = new TransactionStatusChangeEvent(
        TransactionStatusEnum.APPROVED,
        transactionExternalId,
      );

      this.clientKafka.emit(TRANSACTION_STATUS_APPROVED, responseEvent);
    }
  }
}
