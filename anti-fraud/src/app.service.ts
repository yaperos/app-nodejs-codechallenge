import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { CheckEventTransactionDto } from './dtos/check-event-transaction.dto';
import { LIMIT_AMOUNT, TransactionStatus } from './shared/constants';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_EVENTS') private readonly kafkaClient: ClientKafka,
  ) {}
  
  checkLimitAmountTransaction(transactionEvent: CheckEventTransactionDto) {
    console.log({transactionEvent});
    const { transactionExternalId, value } = transactionEvent;
    const status = value > LIMIT_AMOUNT ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    return this.kafkaClient.emit(
      'transaction-updated',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
