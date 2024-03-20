import type { TransferStatus } from '../interfaces/transaction.interface';

export class TransactionEvent {
  constructor(
    public readonly externalId: string,
    public readonly status: TransferStatus,
  ) {}

  toString() {
    return JSON.stringify({
      externalId: this.externalId,
      status: this.status,
    });
  }
}
