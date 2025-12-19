import { TransactionStatus } from './transaction-status.enum';
import { TransactionType } from './transaction-type.enum';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly type: TransactionType,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public status: TransactionStatus,
  ) {}

  static fromPrimitives(data: {
    id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    createdAt: Date;
    updatedAt: Date;
  }): Transaction {
    return new Transaction(
      data.id,
      data.amount,
      data.accountExternalIdDebit,
      data.accountExternalIdCredit,
      data.type,
      data.createdAt,
      data.updatedAt,
      data.status,
    );
  }

  updateStatus(newStatus: TransactionStatus): Transaction {
    this.status = newStatus;
    this.updatedAt = new Date();
    return this;
  }
}
