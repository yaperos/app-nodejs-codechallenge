export class TransactionPresenter {
  transactionExternalId: string;
  transactionStatus: string;

  constructor(transactionExternalId: string, transactionStatus: string) {
    this.transactionExternalId = transactionExternalId;
    this.transactionStatus = transactionStatus;
  }
}
