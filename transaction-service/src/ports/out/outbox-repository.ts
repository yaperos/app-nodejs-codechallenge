import { OutboxMessage } from '@domain/outbox';

export interface OutboxRepository {
  enqueue(message: OutboxMessage): Promise<void>;
  dequeueBatch(limit: number): Promise<OutboxMessage[]>;
  markPublished(id: string): Promise<void>;
  markFailed(id: string, attempts: number, nextAttemptAt: Date): Promise<void>;
  withGlobalAdvisoryLock<T>(lockKey: bigint, task: () => Promise<T>): Promise<T | null>;
}
