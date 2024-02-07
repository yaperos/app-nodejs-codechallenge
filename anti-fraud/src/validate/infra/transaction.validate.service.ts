import { Injectable } from '@nestjs/common';
import { TransactionValidate } from '../app/transaction.validate';
import { TransactionStatusProducerKafka } from './transaction.status.producer';

@Injectable()
export class TransactionValidateService extends TransactionValidate {
  constructor(broker: TransactionStatusProducerKafka) {
    super(broker);
  }
}
