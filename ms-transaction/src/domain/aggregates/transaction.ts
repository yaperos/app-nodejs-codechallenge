import { AggregateRoot } from '@nestjs/cqrs';
import { TransactionStatus } from '../../core/contants';

export type TransactionEssential = {
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly tranferTypeId: number;
  readonly value: number;
};

export type TransactionOptional = {
  readonly transactionExternalId: string;
  readonly status: number;
};

export type TransactionProperties = Required<TransactionEssential> &
  Partial<TransactionOptional>;

export class Transaction extends AggregateRoot {
  private readonly transactionExternalId: string;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly tranferTypeId: number;
  private readonly value: number;
  private readonly status: number;

  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(properties: TransactionProperties) {
    super();
    Object.assign(this, properties);
    this.createdAt = new Date();
    this.status = properties.transactionExternalId
      ? properties.status
      : TransactionStatus.PENDING;
  }
  properties() {
    return {
      transactionExternalId: this.transactionExternalId,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(fields: Partial<TransactionOptional>) {
    Object.assign(this, fields);
    this.updatedAt = new Date();
  }
}
