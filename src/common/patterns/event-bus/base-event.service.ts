import { Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface BaseEvent<T = unknown> {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: Date;
  version: number;
  metadata?: EventMetadata;
  payload: T;
}

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  userId?: string;
  tenantId?: string;
  source?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EventHandlerOptions {
  preserveOrder: boolean;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  enableIdempotency: boolean;
}

const DEFAULT_EVENT_OPTIONS: EventHandlerOptions = {
  preserveOrder: true,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  enableIdempotency: true,
};

type EventHandler = (event: BaseEvent) => Promise<void>;

export abstract class BaseEventService {
  protected readonly logger: Logger;
  protected readonly processedEvents = new Set<string>();
  protected readonly eventHandlers = new Map<string, EventHandler[]>();
  protected readonly options: EventHandlerOptions;

  constructor(
    protected readonly serviceName: string,
    protected readonly kafkaClient?: ClientKafka,
    options?: Partial<EventHandlerOptions>
  ) {
    this.logger = new Logger(`${this.constructor.name}:${serviceName}`);
    this.options = { ...DEFAULT_EVENT_OPTIONS, ...options };
  }

  async publishEvent<T = unknown>(
    eventType: string,
    aggregateId: string,
    payload: T,
    metadata?: Partial<EventMetadata>
  ): Promise<BaseEvent> {
    const event: BaseEvent = {
      eventId: uuidv4(),
      eventType,
      aggregateId,
      aggregateType: this.getAggregateType(),
      timestamp: new Date(),
      version: 1,
      metadata: {
        source: this.serviceName,
        ...metadata,
      },
      payload,
    };

    this.logger.log(
      `Publishing event: ${eventType} for aggregate ${aggregateId} ` +
      `(Event ID: ${event.eventId})`
    );

    try {
      if (this.kafkaClient) {
        await this.emitToKafka(event);
      }

      await this.handleEventLocally(event);

      this.logger.debug(`Event ${event.eventId} published successfully`);
      return event;
    } catch (error) {
      this.logger.error(
        `Failed to publish event ${event.eventId}: ${(error as Error).message}`
      );
      throw error;
    }
  }

  on(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);

    this.logger.log(`Subscribed to event type: ${eventType}`);
  }

  async handleEvent(event: BaseEvent): Promise<void> {
    const startTime = Date.now();

    this.logger.debug(
      `Handling event ${event.eventId} of type ${event.eventType}`
    );

    if (this.options.enableIdempotency && this.processedEvents.has(event.eventId)) {
      this.logger.warn(`Event ${event.eventId} already processed, skipping`);
      return;
    }

    try {
      const handlers = this.eventHandlers.get(event.eventType) || [];

      if (handlers.length === 0) {
        this.logger.debug(`No handlers registered for event type ${event.eventType}`);
        return;
      }

      if (this.options.preserveOrder) {
        for (const handler of handlers) {
          await this.executeHandler(handler, event);
        }
      } else {
        await Promise.all(
          handlers.map(handler => this.executeHandler(handler, event))
        );
      }

      if (this.options.enableIdempotency) {
        this.processedEvents.add(event.eventId);
        this.cleanupProcessedEvents();
      }

      const duration = Date.now() - startTime;
      this.logger.debug(
        `Event ${event.eventId} handled successfully in ${duration}ms`
      );
    } catch (error) {
      this.logger.error(
        `Failed to handle event ${event.eventId}: ${(error as Error).message}`
      );
      throw error;
    }
  }

  private async executeHandler(
    handler: EventHandler,
    event: BaseEvent
  ): Promise<void> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        await this.withTimeout(
          handler(event),
          this.options.timeout
        );
        return;
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.options.maxRetries) {
          this.logger.warn(
            `Handler failed for event ${event.eventId}, attempt ${attempt}/${this.options.maxRetries}. ` +
            `Retrying in ${this.options.retryDelay}ms...`
          );
          await this.sleep(this.options.retryDelay);
        }
      }
    }

    throw lastError!;
  }

  private async emitToKafka(event: BaseEvent): Promise<void> {
    if (!this.kafkaClient) return;

    const topic = this.getTopicName(event.eventType);
    const key = event.aggregateId;
    const value = JSON.stringify(event);

    this.kafkaClient.emit(topic, {
      key,
      value,
      headers: {
        eventId: event.eventId,
        eventType: event.eventType,
        source: this.serviceName,
        timestamp: event.timestamp.toISOString(),
      },
    });
  }

  private async handleEventLocally(event: BaseEvent): Promise<void> {
    const handlers = this.eventHandlers.get(event.eventType) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error(
          `Local handler failed for event ${event.eventId}: ${(error as Error).message}`
        );
      }
    }
  }

  protected getTopicName(eventType: string): string {
    return eventType
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .toLowerCase();
  }

  protected abstract getAggregateType(): string;

  private cleanupProcessedEvents(): void {
    if (this.processedEvents.size > 10000) {
      const eventsToKeep = Array.from(this.processedEvents).slice(-5000);
      this.processedEvents.clear();
      eventsToKeep.forEach(id => this.processedEvents.add(id));
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async replayEvents(
    fromTimestamp: Date,
    toTimestamp: Date,
    eventTypes?: string[]
  ): Promise<void> {
    this.logger.log(
      `Replaying events from ${fromTimestamp} to ${toTimestamp}` +
      (eventTypes ? ` for types: ${eventTypes.join(', ')}` : '')
    );
  }

  getEventStatistics(): {
    processedEvents: number;
    registeredHandlers: Array<{
      eventType: string;
      handlerCount: number;
    }>;
  } {
    return {
      processedEvents: this.processedEvents.size,
      registeredHandlers: Array.from(this.eventHandlers.entries()).map(
        ([type, handlers]) => ({
          eventType: type,
          handlerCount: handlers.length,
        })
      ),
    };
  }
}