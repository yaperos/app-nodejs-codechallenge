import { RepositoryTransactionContext } from './transaction-context';

export interface OutboxEvent {
  id?: string;
  eventType: string;
  payload: Record<string, unknown>;
  aggregateId: string;
  processed: boolean;
  createdAt?: Date;
}

export interface OutboxEventRepository {
  create(
    event: OutboxEvent,
    context?: RepositoryTransactionContext,
  ): Promise<OutboxEvent>;

  findUnprocessed(
    context?: RepositoryTransactionContext,
  ): Promise<OutboxEvent[]>;

  markAsProcessed(
    id: string,
    context?: RepositoryTransactionContext,
  ): Promise<void>;
}
