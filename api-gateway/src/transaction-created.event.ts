import { TRANSACTION_TYPE, TRANSACTION_STATUS } from './constants/app.constant';

export class TransactionCreatedEvent {
  transactionExternalId: string;
  transactionType: number;
  transactionStatus: number;
  valueTx: number;

  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly AmountValue: number,
  ) {
    this.transactionExternalId =
      accountExternalIdDebit === null
        ? accountExternalIdCredit
        : accountExternalIdDebit;
    this.transactionType =
      accountExternalIdDebit === null
        ? TRANSACTION_TYPE.CREDIT.id
        : TRANSACTION_TYPE.DEBIT.id;
    this.transactionStatus = tranferTypeId;
    this.valueTx = AmountValue;
  }

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      transactionType: this.transactionType,
      transactionStatus: this.transactionStatus,
      valueTx: this.valueTx,
    });
  }
}
