import { OutboxMessage } from '@domain/outbox';
import { TransactionStatusChangedEvent } from '@domain/transaction';

export interface EventPublisher {
  publishOutboxMessage(message: OutboxMessage): Promise<void>;
  publishTransactionStatusChanged(event: TransactionStatusChangedEvent): Promise<void>;
}
