// import { IHeaders, Message } from 'kafkajs';

export class TransactionCreatedMessage {
  public readonly value: any;

  constructor(
    transactionId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ) {
    this.value = {
      transactionId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    };
  }
}
