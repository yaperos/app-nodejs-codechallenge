import { AggregateRoot } from '@app/common';
import { ExternalTransactionStatus } from './enums';

export class ExternalTransaction extends AggregateRoot {
  static DEFAULT_STATUS = ExternalTransactionStatus.PENDING;

  constructor(
    readonly id: string,
    readonly transactionType: string,
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly value: number,
    readonly status: ExternalTransactionStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  toPrimitives() {
    return {
      transactionExternalId: this.id,
      transactionType: {
        name: this.transactionType,
      },
      transactionStatus: {
        name: this.status,
      },
      value: this.value,
      createdAt: this.createdAt,
    };
  }
}
