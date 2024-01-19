import { AuditableAggregateRoot } from 'src/modules/shared/domain/auditable-aggregate-root';

import { TransactionCreatedEvent } from './events/transaction-created.event';
import { TransactionUpdatedEvent } from './events/transaction-updated.event';
import { TransactionAccountExternalId } from './transaction-account-external-id';
import { TransactionAmount } from './transaction-amount';
import { TransactionId } from './transaction-id';
import { TransactionTransferType } from './transaction-transfer-type';
import {
  TransactionValidationStatus,
  ValidationStatus,
} from './transaction-validation-status';

interface TransactionPrimitiveProps {
  id: string;
  creditAccountExternalId: string;
  debitAccountExternalId: string;
  amount: number;
  transferType: string;
  validationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction extends AuditableAggregateRoot {
  private id: TransactionId;
  private creditAccountExternalId: TransactionAccountExternalId;
  private debitAccountExternalId: TransactionAccountExternalId;
  private amount: TransactionAmount;
  private transferType: TransactionTransferType;
  private validationStatus: TransactionValidationStatus;

  public constructor({
    id,
    creditAccountExternalId,
    debitAccountExternalId,
    amount,
    transferType,
    validationStatus,
    createdAt,
    updatedAt,
  }: {
    id: TransactionId;
    creditAccountExternalId: TransactionAccountExternalId;
    debitAccountExternalId: TransactionAccountExternalId;
    amount: TransactionAmount;
    transferType: TransactionTransferType;
    validationStatus: TransactionValidationStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(createdAt, updatedAt);
    this.id = id;
    this.creditAccountExternalId = creditAccountExternalId;
    this.debitAccountExternalId = debitAccountExternalId;
    this.amount = amount;
    this.transferType = transferType;
    this.validationStatus = validationStatus;
  }

  static create({
    id,
    creditAccountExternalId,
    debitAccountExternalId,
    amount,
    transferType,
  }: {
    id: TransactionId;
    creditAccountExternalId: TransactionAccountExternalId;
    debitAccountExternalId: TransactionAccountExternalId;
    amount: TransactionAmount;
    transferType: TransactionTransferType;
  }): Transaction {
    const transaction = new Transaction({
      id,
      creditAccountExternalId,
      debitAccountExternalId,
      amount,
      transferType,
      validationStatus: new TransactionValidationStatus(
        ValidationStatus.PENDING,
      ),
    });

    transaction.recordEvent(
      new TransactionCreatedEvent({
        aggregateId: transaction.getId(),
        amount: transaction.getAmount(),
      }),
    );

    return transaction;
  }

  static fromPrimitives({
    id,
    creditAccountExternalId,
    debitAccountExternalId,
    amount,
    transferType,
    validationStatus,
    createdAt,
    updatedAt,
  }: TransactionPrimitiveProps): Transaction {
    return new Transaction({
      id: new TransactionId(id),
      creditAccountExternalId: new TransactionAccountExternalId(
        creditAccountExternalId,
      ),
      debitAccountExternalId: new TransactionAccountExternalId(
        debitAccountExternalId,
      ),
      amount: new TransactionAmount(amount),
      transferType: TransactionTransferType.fromValue(transferType),
      validationStatus: TransactionValidationStatus.fromValue(validationStatus),
      createdAt,
      updatedAt,
    });
  }

  approveTransaction() {
    this.validationStatus = new TransactionValidationStatus(
      ValidationStatus.APPROVED,
    );

    this.recordEvent(
      new TransactionUpdatedEvent({
        aggregateId: this.getId(),
      }),
    );
  }

  rejectTransaction() {
    this.validationStatus = new TransactionValidationStatus(
      ValidationStatus.REJECTED,
    );

    this.recordEvent(
      new TransactionUpdatedEvent({
        aggregateId: this.getId(),
      }),
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      creditAccountExternalId: this.creditAccountExternalId.value,
      debitAccountExternalId: this.debitAccountExternalId.value,
      amount: this.amount.value,
      transferType: this.transferType.value,
      validationStatus: this.validationStatus.value,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  getId(): string {
    return this.id.value;
  }

  getCreditAccountExternalId(): string {
    return this.creditAccountExternalId.value;
  }

  getDebitAccountExternalId(): string {
    return this.debitAccountExternalId.value;
  }

  getAmount(): number {
    return this.amount.value;
  }

  getTransferType(): string {
    return this.transferType.value;
  }

  getTransferTypeName(): string {
    return this.transferType.getName();
  }

  getValidationStatus(): string {
    return this.validationStatus.value;
  }
}
