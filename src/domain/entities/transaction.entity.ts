import { v4 as uuidv4 } from 'uuid';
import { TransactionStatusEntity, TransactionStatus } from './transaction-status.enum';
import { TransactionTypeEntity } from './transaction-type.entity';

export interface CreateTransactionParams {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export class TransactionEntity {
  constructor(
    public readonly transactionExternalId: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly value: number,
    public readonly transactionType: TransactionTypeEntity,
    public transactionStatus: TransactionStatusEntity,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: CreateTransactionParams): TransactionEntity {
    const now = new Date();
    return new TransactionEntity(
      uuidv4(),
      params.accountExternalIdDebit,
      params.accountExternalIdCredit,
      params.tranferTypeId,
      params.value,
      TransactionTypeEntity.transfer(),
      TransactionStatusEntity.pending(),
      now,
      now,
    );
  }

  updateStatus(status: TransactionStatus): void {
    this.transactionStatus = new TransactionStatusEntity(status);
    this.updatedAt = new Date();
  }

  approve(): void {
    this.updateStatus(TransactionStatus.APPROVED);
  }

  reject(): void {
    this.updateStatus(TransactionStatus.REJECTED);
  }

  shouldBeRejectedByValue(): boolean {
    return this.value > 1000;
  }

  isPending(): boolean {
    return this.transactionStatus.isPending();
  }

  isApproved(): boolean {
    return this.transactionStatus.isApproved();
  }

  isRejected(): boolean {
    return this.transactionStatus.isRejected();
  }

  toResponse() {
    return {
      transactionExternalId: this.transactionExternalId,
      transactionType: {
        name: this.transactionType.name,
      },
      transactionStatus: {
        name: this.transactionStatus.name,
      },
      value: this.value,
      createdAt: this.createdAt,
    };
  }
} 