// import { IHeaders, Message } from 'kafkajs';

export class TransactionApprovedMessage {
  public readonly value: any;

  constructor(transactionId: string) {
    this.value = {
      transactionId,
    };
  }
}
