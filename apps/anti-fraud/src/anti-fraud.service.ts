import {
  MAX_TRANSACTION_VALUE,
  TRANSACTION_CHECKED_EVENT_TOPIC,
  TRANSACTION_STATUS,
} from '../../../libs/shared-constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly eventEmitter: ClientKafka,
  ) {}

  validateTransaction({
    value,
    transactionExternalId,
  }: {
    value: number;
    transactionExternalId: string;
  }) {
    let transactionStatus = TRANSACTION_STATUS.APPROVED;

    if (value > MAX_TRANSACTION_VALUE) {
      transactionStatus = TRANSACTION_STATUS.REJECTED;
    }

    this.eventEmitter.emit(
      TRANSACTION_CHECKED_EVENT_TOPIC,
      JSON.stringify({
        transactionExternalId,
        transactionStatus,
      }),
    );
  }
}
