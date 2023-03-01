import { IsEnum, IsUUID } from 'class-validator';
import { TransactionStatusEnum } from 'src/shared/enums/transaction-status.enum';
import type { Transaction } from 'src/transactions/entities/transaction.entity';

export class TransactionStatusChangeEvent {
  @IsEnum(TransactionStatusEnum)
  readonly status: TransactionStatusEnum;

  @IsUUID()
  readonly transactionExternalId: Transaction['transactionExternalId'];

  constructor(
    status: TransactionStatusEnum,
    transactionExternalId: Transaction['transactionExternalId'],
  ) {
    this.status = status;
    this.transactionExternalId = transactionExternalId;
  }

  toString() {
    return JSON.stringify(this);
  }
}
