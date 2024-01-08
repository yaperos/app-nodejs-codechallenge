// import { IHeaders, Message } from 'kafkajs';

export class TransactionRejectedMessage {
  public readonly value: any;

  constructor(transactionId: string, reason: string) {
    this.value = {
      transactionId,
      reason,
    };
  }
}
