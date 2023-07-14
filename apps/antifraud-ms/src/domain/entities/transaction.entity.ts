import { APP_AMOUNT_REJECTED } from '../../../config/app.config';
import { TransactionStatusEnum } from '../enums/transaction.enum';

export class TransactionEntity {
  constructor(
    readonly transactionExternalId: string,
    readonly value: number,
    readonly transactionStatus: TransactionStatusEnum,
  ) {}

  static create(
    transactionExternalId: string,
    value: number,
  ): TransactionEntity {
    const status = TransactionEntity.byReject(value)
      ? TransactionStatusEnum.REJECTED
      : TransactionStatusEnum.APPROVED;

    return new TransactionEntity(transactionExternalId, value, status);
  }

  static byReject(value: number): boolean {
    return value > APP_AMOUNT_REJECTED;
  }

  toJSON(): any {
    return {
      transactionExternalId: this.transactionExternalId,
      value: this.value,
      transactionStatus: this.transactionStatus,
    };
  }
}
