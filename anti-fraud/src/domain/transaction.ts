import { AggregateRoot } from '@nestjs/cqrs';
import { TransactionOpenedEvent } from './event/transaction-opened.event';

export enum STATUS_TYPE {
  pending,
  approved,
  rejected,
}

export type TransactionEssentialProperties = Required<{
  readonly id: string;
  transactionStatus: STATUS_TYPE;
  readonly value: number;
}>;

export interface TransactionInterface {
  properties: () => TransactionEssentialProperties;
  validateValue: () => TransactionEssentialProperties;
  commit: () => void;
}

export class TransactionImplement extends AggregateRoot implements TransactionInterface {
  private readonly id: string;
  private transactionStatus: STATUS_TYPE;
  private readonly value: number;

  constructor(properties: TransactionEssentialProperties) {
    super();
    Object.assign(this, properties);
  }
  properties(): TransactionEssentialProperties {
    return {
      id: this.id,
      transactionStatus: this.transactionStatus,
      value: this.value,
    };
  }

  validateValue(): TransactionEssentialProperties {
    const newStatusTransaction = this.value > 1000 ? STATUS_TYPE.rejected : STATUS_TYPE.approved;

    this.transactionStatus = newStatusTransaction;

    this.apply(Object.assign(new TransactionOpenedEvent(), this));
    return {
      id: this.id,
      transactionStatus: this.transactionStatus,
      value: this.value,
    };
  }
}
