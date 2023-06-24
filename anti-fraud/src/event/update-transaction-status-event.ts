import { TransactionStatus } from '../enum/transaction-status';

export class UpdateTransactionStatusEvent {
  constructor(
    public readonly transactionExternalId: string,
    public readonly status: TransactionStatus,
  ) {}

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      status: this.status,
    });
  }
}
