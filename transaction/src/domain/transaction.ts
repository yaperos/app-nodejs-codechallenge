import { AggregateRoot } from '@nestjs/cqrs';
import { Transaction } from '../application/get-transaction/transaction.query';
import { TransactionOpenedEvent } from './event/transaction-opened.event';
import { TRANFER_TYPE_NAME } from './transaction.tranfer.type.id';

export enum STATUS_TYPE {
  pending,
  approved,
  rejected,
}


const STATUS_TYPE_NAME = {
  0: 'pending',
  1: 'approved',
  2: 'rejected',
}


export type TransactionEssentialProperties = Required<{
  readonly id: string;
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly tranferTypeId: number;
  readonly value: number;
  transactionStatus: STATUS_TYPE;
}>;

export type TransactionOptionalProperties = Partial<{
  readonly openedAt: Date;
  readonly updatedAt: Date;
  readonly closedAt: Date | null;
}>;

export type TransactionProperties = TransactionEssentialProperties & Required<TransactionOptionalProperties>;

export interface TransactionInterface {
  properties: () => TransactionProperties;
  propertiesResponse: () => Transaction;
  openAccount: () => void;
  commit: () => void;
  updateStatus: (status: STATUS_TYPE) => void;
}

export class TransactionImplement extends AggregateRoot implements TransactionInterface {
  private readonly id: string;
  private transactionStatus: STATUS_TYPE;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly tranferTypeId: number;
  private readonly value: number;
  private readonly openedAt: Date = new Date();
  private updatedAt: Date = new Date();
  private closedAt: Date | null = null;

  constructor(properties: TransactionEssentialProperties | TransactionOptionalProperties) {
    super();
    Object.assign(this, properties);
  }
  propertiesResponse(): Transaction {
    return {
      transactionExternalId: this.id,
      transactionStatus: { name: STATUS_TYPE_NAME[this.transactionStatus] },
      tranferType: { name: TRANFER_TYPE_NAME[this.tranferTypeId] },
      createdAt: this.openedAt,
      value: this.value,
    };
  }

  properties(): TransactionProperties {
    return {
      id: this.id,
      transactionStatus: this.transactionStatus,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      openedAt: this.openedAt,
      updatedAt: this.updatedAt,
      closedAt: this.closedAt,
      value: this.value,
    };
  }

  updateStatus(status: STATUS_TYPE): void {
    this.updatedAt = new Date();
    this.transactionStatus = status;
  }

  openAccount(): void {
    this.apply(Object.assign(new TransactionOpenedEvent(), this));
  }
  
}
