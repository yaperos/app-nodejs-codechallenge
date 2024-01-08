// import { IHeaders, Message } from 'kafkajs';

import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionStatusUpdatedMessage {
  public readonly value: any;

  constructor(transaction: TransactionEntity) {
    this.value = { ...transaction };
  }
}
