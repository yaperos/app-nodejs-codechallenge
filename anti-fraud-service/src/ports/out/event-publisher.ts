import { TransactionStatusChangedEvent } from '@domain/events';

export interface EventPublisher {
  publishStatusChanged(event: TransactionStatusChangedEvent): Promise<void>;
}
