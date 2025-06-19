import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface TransactionStatusUpdatedEvent {
  transactionExternalId: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

export interface AntiFraudPort {
  sendTransactionCreated(transaction: TransactionEntity): Promise<void>;
  onTransactionStatusUpdated(
    callback: (event: TransactionStatusUpdatedEvent) => Promise<void>,
  ): Promise<void>;
} 