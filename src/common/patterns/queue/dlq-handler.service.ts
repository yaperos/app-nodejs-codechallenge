import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";

export interface DLQMessage {
  originalQueue: string;
  jobId: string | number;
  data: unknown;
  error: string;
  errorStack?: string;
  attempts: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DLQHandlerOptions {
  maxRetries: number;
  retryDelay: number;
  persistFailures: boolean;
  ttl: number;
  shouldRetry?: (message: DLQMessage) => boolean;
  onPermanentFailure?: (message: DLQMessage) => Promise<void>;
}

const DEFAULT_DLQ_OPTIONS: DLQHandlerOptions = {
  maxRetries: 3,
  retryDelay: 60000,
  persistFailures: true,
  ttl: 604800,
  shouldRetry: () => true,
};

@Injectable()
export class DLQHandlerService {
  private readonly logger = new Logger(DLQHandlerService.name);
  private readonly dlqMessages = new Map<string, DLQMessage[]>();
  private readonly options: DLQHandlerOptions;

  constructor(options?: Partial<DLQHandlerOptions>) {
    this.options = { ...DEFAULT_DLQ_OPTIONS, ...options };
  }

  async sendToDLQ(
    job: Job,
    error: Error,
    originalQueue: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const dlqMessage: DLQMessage = {
      originalQueue,
      jobId: job.id,
      data: job.data,
      error: error.message,
      errorStack: error.stack,
      attempts: job.attemptsMade,
      timestamp: new Date(),
      metadata,
    };

    this.logger.error(
      `Sending job ${job.id} from queue ${originalQueue} to DLQ. ` +
        `Error: ${error.message}, Attempts: ${job.attemptsMade}`
    );

    const queueMessages = this.dlqMessages.get(originalQueue) || [];
    queueMessages.push(dlqMessage);
    this.dlqMessages.set(originalQueue, queueMessages);

    this.emitDLQMetrics(originalQueue, "added");

    if (this.options.persistFailures) {
      await this.persistDLQMessage(dlqMessage);
    }

    if (
      this.options.shouldRetry!(dlqMessage) &&
      job.attemptsMade < this.options.maxRetries
    ) {
      await this.scheduleRetry(dlqMessage);
    } else if (this.options.onPermanentFailure) {
      await this.options.onPermanentFailure(dlqMessage);
    }
  }

  async processDLQMessages(queueName?: string): Promise<void> {
    const queues = queueName
      ? [queueName]
      : Array.from(this.dlqMessages.keys());

    for (const queue of queues) {
      const messages = this.dlqMessages.get(queue) || [];

      this.logger.log(
        `Processing ${messages.length} DLQ messages for queue ${queue}`
      );

      for (const message of messages) {
        if (this.shouldProcessMessage(message)) {
          await this.retryMessage(message);
        }
      }
    }
  }

  private async retryMessage(message: DLQMessage): Promise<void> {
    try {
      this.logger.log(
        `Retrying DLQ message ${message.jobId} from queue ${message.originalQueue}`
      );

      this.removeFromDLQ(message);

      this.emitDLQMetrics(message.originalQueue, "retried");
    } catch (error) {
      this.logger.error(
        `Failed to retry DLQ message ${message.jobId}: ${(error as Error).message}`
      );

      message.attempts++;

      if (message.attempts >= this.options.maxRetries) {
        this.logger.error(
          `DLQ message ${message.jobId} exceeded max retries. Moving to permanent failure.`
        );

        if (this.options.onPermanentFailure) {
          await this.options.onPermanentFailure(message);
        }

        this.removeFromDLQ(message);
        this.emitDLQMetrics(message.originalQueue, "permanent_failure");
      }
    }
  }

  private async scheduleRetry(message: DLQMessage): Promise<void> {
    setTimeout(() => {
      this.retryMessage(message);
    }, this.options.retryDelay);
  }

  private shouldProcessMessage(message: DLQMessage): boolean {
    const messageAge = Date.now() - message.timestamp.getTime();
    const isExpired = messageAge > this.options.ttl * 1000;

    if (isExpired) {
      this.logger.warn(
        `DLQ message ${message.jobId} expired (TTL: ${this.options.ttl}s)`
      );
      this.removeFromDLQ(message);
      return false;
    }

    return this.options.shouldRetry!(message);
  }

  private removeFromDLQ(message: DLQMessage): void {
    const messages = this.dlqMessages.get(message.originalQueue) || [];
    const index = messages.findIndex((m) => m.jobId === message.jobId);

    if (index > -1) {
      messages.splice(index, 1);
      this.dlqMessages.set(message.originalQueue, messages);
    }
  }

  getStats(queueName?: string): Record<
    string,
    {
      total: number;
      byError: Record<string, number>;
      averageAttempts: number;
      oldestMessage: Date | null;
    }
  > {
    const queues = queueName
      ? [queueName]
      : Array.from(this.dlqMessages.keys());
    const stats: Record<
      string,
      {
        total: number;
        byError: Record<string, number>;
        averageAttempts: number;
        oldestMessage: Date | null;
      }
    > = {};

    for (const queue of queues) {
      const messages = this.dlqMessages.get(queue) || [];
      stats[queue] = {
        total: messages.length,
        byError: this.groupByError(messages),
        averageAttempts: this.calculateAverageAttempts(messages),
        oldestMessage: this.getOldestMessage(messages),
      };
    }

    return stats;
  }

  clearDLQ(queueName?: string): void {
    if (queueName) {
      this.dlqMessages.delete(queueName);
      this.logger.log(`Cleared DLQ for queue ${queueName}`);
    } else {
      this.dlqMessages.clear();
      this.logger.log("Cleared all DLQ messages");
    }
  }

  getMessages(queueName?: string, limit = 100): DLQMessage[] {
    if (queueName) {
      return (this.dlqMessages.get(queueName) || []).slice(0, limit);
    }

    const allMessages: DLQMessage[] = [];
    for (const messages of this.dlqMessages.values()) {
      allMessages.push(...messages);
      if (allMessages.length >= limit) break;
    }

    return allMessages.slice(0, limit);
  }

  private async persistDLQMessage(message: DLQMessage): Promise<void> {
    this.logger.debug(`Persisting DLQ message ${message.jobId} to database`);
  }

  private emitDLQMetrics(queueName: string, action: string): void {
    this.logger.debug(`DLQ metric: queue=${queueName}, action=${action}`);
  }

  private groupByError(messages: DLQMessage[]): Record<string, number> {
    return messages.reduce(
      (acc, msg) => {
        const errorType = msg.error.split(":")[0] || "Unknown";
        acc[errorType] = (acc[errorType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private calculateAverageAttempts(messages: DLQMessage[]): number {
    if (messages.length === 0) return 0;
    const totalAttempts = messages.reduce((sum, msg) => sum + msg.attempts, 0);
    return totalAttempts / messages.length;
  }

  private getOldestMessage(messages: DLQMessage[]): Date | null {
    if (messages.length === 0) return null;
    return messages.reduce(
      (oldest, msg) => (msg.timestamp < oldest ? msg.timestamp : oldest),
      messages[0].timestamp
    );
  }
}
