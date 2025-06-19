export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ITransactionStatus {
  name: TransactionStatus;
}

export class TransactionStatusEntity implements ITransactionStatus {
  constructor(public readonly name: TransactionStatus) {}

  static pending(): TransactionStatusEntity {
    return new TransactionStatusEntity(TransactionStatus.PENDING);
  }

  static approved(): TransactionStatusEntity {
    return new TransactionStatusEntity(TransactionStatus.APPROVED);
  }

  static rejected(): TransactionStatusEntity {
    return new TransactionStatusEntity(TransactionStatus.REJECTED);
  }

  isPending(): boolean {
    return this.name === TransactionStatus.PENDING;
  }

  isApproved(): boolean {
    return this.name === TransactionStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.name === TransactionStatus.REJECTED;
  }
} 