import { IsNumber, IsUUID } from 'class-validator';
import type { Transaction } from 'src/transactions/entities/transaction.entity';

export class NewTransactionEvent {
  @IsUUID()
  readonly transactionExternalId: Transaction['transactionExternalId'];

  @IsNumber()
  readonly transactionValue: Transaction['value'];

  constructor(
    transactionExternalId: Transaction['transactionExternalId'],
    transactionValue: Transaction['value'],
  ) {
    this.transactionExternalId = transactionExternalId;
    this.transactionValue = transactionValue;
  }

  toString() {
    return JSON.stringify(this);
  }
}
