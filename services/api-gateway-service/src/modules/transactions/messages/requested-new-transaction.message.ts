// import { IHeaders, Message } from 'kafkajs';

export class RequestedNewTransactionMessage {
  public readonly value: any;

  constructor(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ) {
    this.value = {
      transactionExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    };
  }
}
