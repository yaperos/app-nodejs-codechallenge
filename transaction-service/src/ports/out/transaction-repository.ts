import { OutboxMessage } from '@domain/outbox';
import { Transaction } from '@domain/transaction';

export interface TransactionRepository {
  createWithOutbox(
    transaction: Transaction,
    outboxMessage: OutboxMessage,
  ): Promise<Transaction>;
  findByExternalId(transactionExternalId: string): Promise<Transaction | null>;
  updateStatus(
    transactionExternalId: string,
    status: Transaction['status'],
  ): Promise<void>;
}
