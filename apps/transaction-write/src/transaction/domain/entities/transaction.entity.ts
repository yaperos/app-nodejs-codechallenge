import { TransactionStatus } from './status.entity';
import { TransactionType } from './transaction-type.entity';

export class Transaction {
  private readonly id?: string;
  private readonly transactionExternalId: string;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly value: number;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;
  private transactionStatus: TransactionStatus;
  private readonly transactionType: TransactionType;

  private constructor(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.transactionExternalId = transactionExternalId;
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.value = value;
    this.transactionStatus = transactionStatus;
    this.transactionType = transactionType;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
  ): Transaction {
    if (value <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    return new Transaction(
      transactionExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      transactionStatus,
      transactionType,
    );
  }

  updateStatus(newStatus: TransactionStatus): void {
    this.transactionStatus = newStatus;
  }

  static reconstitute(
    transactionExternalId: string,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    transactionStatus: TransactionStatus,
    transactionType: TransactionType,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): Transaction {
    return new Transaction(
      transactionExternalId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      transactionStatus,
      transactionType,
      id,
      createdAt,
      updatedAt,
    );
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
