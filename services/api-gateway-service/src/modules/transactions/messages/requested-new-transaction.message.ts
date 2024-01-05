// import { IHeaders, Message } from 'kafkajs';

export class RequestedNewTransactionMessage {
  public readonly value: any;

  constructor(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ) {
    this.value = {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    };
  }
}
