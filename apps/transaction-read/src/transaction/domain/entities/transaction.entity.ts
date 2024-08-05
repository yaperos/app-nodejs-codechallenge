import { TransactionStatus } from './status.entity';
import { TransactionType } from './transaction-type.entity';

export class Transaction {
  private readonly id: string;
  private readonly transactionInternalId: string;
  private readonly transactionExternalId: string;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly value: number;
  private readonly createdAt: Date;
  private transactionStatus: TransactionStatus;
  private readonly transactionType: TransactionType;
  private readonly updatedAt?: Date;

  private constructor(
    transactionInternalId: string,
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    createdAt: Date,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
    updatedAt?: Date,
    id?: string,
  ) {
    this.transactionInternalId = transactionInternalId;
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.value = value;
    this.createdAt = createdAt;
    this.transactionStatus = transactionStatus;
    this.transactionType = transactionType;
    this.updatedAt = updatedAt;
    this.id = id;
  }

  static create(
    transactionInternalId: string,
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    createdAt: Date,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
    updatedAt?: Date,
  ): Transaction {
    if (value <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    return new Transaction(
      transactionInternalId,
      transactionExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      createdAt,
      transactionStatus,
      transactionType,
      updatedAt,
    );
  }

  static reconstitute(
    transactionInternalId: string,
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
    createdAt: Date,
    updatedAt: Date,
    id: string,
  ): Transaction {
    return new Transaction(
      transactionInternalId,
      transactionExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      createdAt,
      transactionStatus,
      transactionType,
      updatedAt,
      id,
    );
  }

  getTransactionInternalId(): string {
    return this.transactionExternalId;
  }

  getId(): string {
    return this.id;
  }

  getTransactionExternalId(): string {
    return this.transactionExternalId;
  }

  getAccountExternalIdDebit(): string {
    return this.accountExternalIdDebit;
  }

  getAccountExternalIdCredit(): string {
    return this.accountExternalIdCredit;
  }

  getValue(): number {
    return this.value;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getTransactionStatus(): TransactionStatus {
    return this.transactionStatus;
  }

  getTransactionType(): TransactionType {
    return this.transactionType;
  }
}
