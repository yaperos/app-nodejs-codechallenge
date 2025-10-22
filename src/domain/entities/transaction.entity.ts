import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  P2P = 'P2P',
  PAYMENT = 'PAYMENT',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
  REVERSED = 'REVERSED',
}

export interface ITransactionEntity {
  id: string;
  externalId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  sourceAccountId: string;
  targetAccountId: string;
  status: TransactionStatus;
  metadata: Record<string, string | number | boolean>;
  antifraudScore?: number;
  antifraudStatus?: string;
  antifraudCheckedAt?: Date;
  retryCount: number;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  reversedAt?: Date;
  reversalTransactionId?: string;
}

export class Transaction implements ITransactionEntity {
  id: string;
  externalId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  sourceAccountId: string;
  targetAccountId: string;
  status: TransactionStatus;
  metadata: Record<string, string | number | boolean>;
  antifraudScore?: number;
  antifraudStatus?: string;
  antifraudCheckedAt?: Date;
  retryCount: number;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  reversedAt?: Date;
  reversalTransactionId?: string;

  constructor(params: Partial<ITransactionEntity>) {
    this.id = params.id || uuidv4();
    this.externalId = params.externalId || uuidv4();
    this.type = params.type || TransactionType.P2P;
    this.amount = params.amount || 0;
    this.currency = params.currency || 'PEN';
    this.sourceAccountId = params.sourceAccountId || '';
    this.targetAccountId = params.targetAccountId || '';
    this.status = params.status || TransactionStatus.PENDING;
    this.metadata = params.metadata || {};
    this.antifraudScore = params.antifraudScore;
    this.antifraudStatus = params.antifraudStatus;
    this.antifraudCheckedAt = params.antifraudCheckedAt;
    this.retryCount = params.retryCount || 0;
    this.idempotencyKey = params.idempotencyKey;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.completedAt = params.completedAt;
    this.failureReason = params.failureReason;
    this.reversedAt = params.reversedAt;
    this.reversalTransactionId = params.reversalTransactionId;
  }

  canProcess(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  markAsProcessing(): void {
    if (!this.canProcess()) {
      throw new Error(`Transaction ${this.id} cannot be processed in status ${this.status}`);
    }
    this.status = TransactionStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  markAsCompleted(): void {
    if (this.status !== TransactionStatus.PROCESSING) {
      throw new Error(`Transaction ${this.id} must be in PROCESSING status to complete`);
    }
    this.status = TransactionStatus.COMPLETED;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  markAsFailed(reason: string): void {
    this.status = TransactionStatus.FAILED;
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  markAsRejected(reason: string): void {
    this.status = TransactionStatus.REJECTED;
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  canRetry(): boolean {
    return (
      this.status === TransactionStatus.FAILED &&
      this.retryCount < 3 &&
      !this.isAntifraudRejected()
    );
  }

  incrementRetry(): void {
    this.retryCount++;
    this.updatedAt = new Date();
  }

  isAntifraudRejected(): boolean {
    return this.antifraudStatus === 'REJECTED';
  }

  setAntifraudResult(score: number, status: string): void {
    this.antifraudScore = score;
    this.antifraudStatus = status;
    this.antifraudCheckedAt = new Date();
    this.updatedAt = new Date();
  }

  canReverse(): boolean {
    return (
      this.status === TransactionStatus.COMPLETED &&
      !this.reversedAt
    );
  }

  markAsReversed(reversalTransactionId: string): void {
    if (!this.canReverse()) {
      throw new Error(`Transaction ${this.id} cannot be reversed`);
    }
    this.status = TransactionStatus.REVERSED;
    this.reversedAt = new Date();
    this.reversalTransactionId = reversalTransactionId;
    this.updatedAt = new Date();
  }
}