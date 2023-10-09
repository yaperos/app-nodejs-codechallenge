import { AggregateRoot } from '../../../shared/domain/aggregateRoot';
import { TransactionAccountExternalIdCredit } from './transactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from './transactionAccountExternalIdDebit';
import { TransactionCreatedAt } from './transactionCreatedAt';
import { TransactionCreatedDomainEvent } from './transactionCreatedDomainEvent';
import { TransactionId } from './transactionId';
import { TransactionStatus } from './transactionStatus';
import { TransactionTransferType } from './transactionTransferType';
import { TransactionType } from './transactionType';
import { TransactionValue } from './transactionValue';

export class Transaction extends AggregateRoot {
  readonly id: TransactionId;
  readonly accountExternalIdCredit: TransactionAccountExternalIdCredit;
  readonly accountExternalIdDebit: TransactionAccountExternalIdDebit;
  status: TransactionStatus;
  readonly transferType: TransactionTransferType;
  readonly type: TransactionType;
  readonly value: TransactionValue;
  readonly createdAt: TransactionCreatedAt;

  constructor(
    id: TransactionId,
    accountExternalIdCredit: TransactionAccountExternalIdCredit,
    accountExternalIdDebit: TransactionAccountExternalIdDebit,
    status: TransactionStatus,
    transferType: TransactionTransferType,
    type: TransactionType,
    value: TransactionValue,
    createdAt: TransactionCreatedAt
  ) {
    super();
    this.id = id;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.status = status;
    this.transferType = transferType;
    this.type = type;
    this.value = value;
    this.createdAt = createdAt;
  }

  static create(
    id: TransactionId,
    accountExternalIdCredit: TransactionAccountExternalIdCredit,
    accountExternalIdDebit: TransactionAccountExternalIdDebit,
    status: TransactionStatus,
    transferType: TransactionTransferType,
    type: TransactionType,
    value: TransactionValue,
    createdAt: TransactionCreatedAt
  ): Transaction {
    const transaction = new Transaction(
      id,
      accountExternalIdCredit,
      accountExternalIdDebit,
      status,
      transferType,
      type,
      value,
      createdAt
    );

    transaction.record(
      new TransactionCreatedDomainEvent({
        aggregateId: transaction.id.value,
        value: transaction.value.value,
        status: transaction.status.value
      })
    );

    return transaction;
  }

  static fromPrimitives(plainData: {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    status: string;
    transferTypeId: number;
    type: string;
    value: number;
    createdAt: Date;
  }): Transaction {
    return new Transaction(
      new TransactionId(plainData.id),
      new TransactionAccountExternalIdCredit(plainData.accountExternalIdDebit),
      new TransactionAccountExternalIdDebit(plainData.accountExternalIdDebit),
      TransactionStatus.fromValue(plainData.status),
      TransactionTransferType.fromValue(String(plainData.transferTypeId)),
      TransactionType.fromValue(plainData.type),
      new TransactionValue(plainData.value),
      new TransactionCreatedAt(plainData.createdAt)
    );
  }

  updateStatus(transactionStatus: TransactionStatus): Transaction {
    return new Transaction(this.id, this.accountExternalIdCredit, this.accountExternalIdDebit, transactionStatus, this.transferType, this.type, this.value, this.createdAt);
  }

  toPrimitives() {
    return {
      id: this.id.value,
      accountExternalIdDebit: this.accountExternalIdDebit.value,
      accountExternalIdCredit: this.accountExternalIdCredit.value,
      status: this.status.value,
      tranferTypeId: this.transferType.value,
      type: this.type.value,
      value: this.value.value,
      createdAt: this.createdAt.value
    };
  }
}
