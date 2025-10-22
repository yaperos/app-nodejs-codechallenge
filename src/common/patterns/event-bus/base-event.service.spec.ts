import { ClientKafka } from '@nestjs/microservices';
import {
  BaseEventService,
  BaseEvent,
  EventHandlerOptions,
  EventMetadata,
} from './base-event.service';

class TestEventService extends BaseEventService {
  constructor(
    serviceName: string,
    kafkaClient?: ClientKafka,
    options?: Partial<EventHandlerOptions>
  ) {
    super(serviceName, kafkaClient, options);
  }

  protected getAggregateType(): string {
    return 'TestAggregate';
  }

  public testGetTopicName(eventType: string): string {
    return this.getTopicName(eventType);
  }
}

describe('BaseEventService', () => {
  let service: TestEventService;
  let mockKafkaClient: jest.Mocked<ClientKafka>;

  beforeEach(() => {
    mockKafkaClient = {
      emit: jest.fn(),
      subscribeToResponseOf: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ClientKafka>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with service name', () => {
      service = new TestEventService('test-service');

      expect(service).toBeDefined();
      expect(service['serviceName']).toBe('test-service');
    });

    it('should initialize with default options', () => {
      service = new TestEventService('test-service');

      expect(service['options']).toEqual({
        preserveOrder: true,
        maxRetries: 3,
        retryDelay: 1000,
        timeout: 30000,
        enableIdempotency: true,
      });
    });

    it('should merge custom options with defaults', () => {
      service = new TestEventService('test-service', undefined, {
        maxRetries: 5,
        timeout: 60000,
      });

      expect(service['options']).toEqual({
        preserveOrder: true,
        maxRetries: 5,
        retryDelay: 1000,
        timeout: 60000,
        enableIdempotency: true,
      });
    });

    it('should initialize with Kafka client', () => {
      service = new TestEventService('test-service', mockKafkaClient);

      expect(service['kafkaClient']).toBe(mockKafkaClient);
    });

    it('should create logger with service name', () => {
      service = new TestEventService('my-service');

      expect(service['logger']).toBeDefined();
    });

    it('should initialize empty processed events set', () => {
      service = new TestEventService('test-service');

      expect(service['processedEvents'].size).toBe(0);
    });

    it('should initialize empty event handlers map', () => {
      service = new TestEventService('test-service');

      expect(service['eventHandlers'].size).toBe(0);
    });
  });

  describe('publishEvent', () => {
    beforeEach(() => {
      service = new TestEventService('test-service', mockKafkaClient);
    });

    it('should create event with correct structure', async () => {
      const event = await service.publishEvent(
        'TransactionCreated',
        'txn-123',
        { amount: 100 }
      );

      expect(event).toMatchObject({
        eventId: expect.any(String),
        eventType: 'TransactionCreated',
        aggregateId: 'txn-123',
        aggregateType: 'TestAggregate',
        timestamp: expect.any(Date),
        version: 1,
        metadata: {
          source: 'test-service',
        },
        payload: { amount: 100 },
      });
    });

    it('should include custom metadata', async () => {
      const metadata: Partial<EventMetadata> = {
        correlationId: 'corr-123',
        userId: 'user-456',
        tenantId: 'tenant-789',
      };

      const event = await service.publishEvent(
        'TestEvent',
        'agg-123',
        { test: 'data' },
        metadata
      );

      expect(event.metadata).toMatchObject({
        source: 'test-service',
        correlationId: 'corr-123',
        userId: 'user-456',
        tenantId: 'tenant-789',
      });
    });

    it('should emit to Kafka when client is provided', async () => {
      await service.publishEvent('TransactionCreated', 'txn-123', { amount: 100 });

      expect(mockKafkaClient.emit).toHaveBeenCalledWith(
        'transaction.created',
        expect.objectContaining({
          key: 'txn-123',
          value: expect.any(String),
          headers: expect.objectContaining({
            eventId: expect.any(String),
            eventType: 'TransactionCreated',
            source: 'test-service',
            timestamp: expect.any(String),
          }),
        })
      );
    });

    it('should not throw when Kafka client is not provided', async () => {
      service = new TestEventService('test-service'); 

      await expect(
        service.publishEvent('TestEvent', 'agg-123', {})
      ).resolves.toBeDefined();
    });

    it('should serialize event to JSON for Kafka', async () => {
      await service.publishEvent('TestEvent', 'agg-123', { test: 'data' });

      const call = mockKafkaClient.emit.mock.calls[0];
      const message = call[1] as { key: string; value: string; headers: Record<string, string> };

      expect(typeof message.value).toBe('string');
      const parsed = JSON.parse(message.value);
      expect(parsed.payload).toEqual({ test: 'data' });
    });

    it('should handle local handlers', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.publishEvent('TestEvent', 'agg-123', { test: 'data' });

      expect(handler).toHaveBeenCalled();
    });

    it('should return the published event', async () => {
      const event = await service.publishEvent('TestEvent', 'agg-123', { test: 'data' });

      expect(event.eventId).toBeDefined();
      expect(event.eventType).toBe('TestEvent');
      expect(event.aggregateId).toBe('agg-123');
    });

    it('should generate unique event IDs', async () => {
      const event1 = await service.publishEvent('Event1', 'agg-1', {});
      const event2 = await service.publishEvent('Event2', 'agg-2', {});

      expect(event1.eventId).not.toBe(event2.eventId);
    });

    it('should handle errors from Kafka', async () => {
      mockKafkaClient.emit.mockImplementation(() => {
        throw new Error('Kafka error');
      });

      await expect(
        service.publishEvent('TestEvent', 'agg-123', {})
      ).rejects.toThrow('Kafka error');
    });
  });

  describe('on (subscribe to event)', () => {
    beforeEach(() => {
      service = new TestEventService('test-service');
    });

    it('should register event handler', () => {
      const handler = jest.fn();
      service.on('TestEvent', handler);

      const handlers = service['eventHandlers'].get('TestEvent');
      expect(handlers).toHaveLength(1);
      expect(handlers![0]).toBe(handler);
    });

    it('should register multiple handlers for same event type', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      service.on('TestEvent', handler1);
      service.on('TestEvent', handler2);
      service.on('TestEvent', handler3);

      const handlers = service['eventHandlers'].get('TestEvent');
      expect(handlers).toHaveLength(3);
    });

    it('should register handlers for different event types', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      service.on('EventType1', handler1);
      service.on('EventType2', handler2);

      expect(service['eventHandlers'].size).toBe(2);
      expect(service['eventHandlers'].get('EventType1')).toHaveLength(1);
      expect(service['eventHandlers'].get('EventType2')).toHaveLength(1);
    });
  });

  describe('handleEvent', () => {
    let mockEvent: BaseEvent;

    beforeEach(() => {
      service = new TestEventService('test-service');
      mockEvent = {
        eventId: 'evt-123',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: { test: 'data' },
      };
    });

    it('should execute registered handlers', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);

      expect(handler).toHaveBeenCalledWith(mockEvent);
    });

    it('should execute multiple handlers', async () => {
      const handler1 = jest.fn().mockResolvedValue(undefined);
      const handler2 = jest.fn().mockResolvedValue(undefined);

      service.on('TestEvent', handler1);
      service.on('TestEvent', handler2);

      await service.handleEvent(mockEvent);

      expect(handler1).toHaveBeenCalledWith(mockEvent);
      expect(handler2).toHaveBeenCalledWith(mockEvent);
    });

    it('should skip when no handlers registered', async () => {
      await expect(service.handleEvent(mockEvent)).resolves.not.toThrow();
    });

    it('should mark event as processed with idempotency enabled', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);

      expect(service['processedEvents'].has('evt-123')).toBe(true);
    });

    it('should skip already processed events', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);
      await service.handleEvent(mockEvent); 

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not skip duplicate events when idempotency disabled', async () => {
      service = new TestEventService('test-service', undefined, {
        enableIdempotency: false,
      });

      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);
      await service.handleEvent(mockEvent);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should execute handlers sequentially when preserveOrder is true', async () => {
      const executionOrder: number[] = [];
      const handler1 = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        executionOrder.push(1);
      });
      const handler2 = jest.fn().mockImplementation(async () => {
        executionOrder.push(2);
      });

      service.on('TestEvent', handler1);
      service.on('TestEvent', handler2);

      await service.handleEvent(mockEvent);

      expect(executionOrder).toEqual([1, 2]);
    });

    it('should execute handlers in parallel when preserveOrder is false', async () => {
      service = new TestEventService('test-service', undefined, {
        preserveOrder: false,
      });

      const handler1 = jest.fn().mockResolvedValue(undefined);
      const handler2 = jest.fn().mockResolvedValue(undefined);

      service.on('TestEvent', handler1);
      service.on('TestEvent', handler2);

      await service.handleEvent(mockEvent);

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should throw error when handler fails', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Handler error'));
      service.on('TestEvent', handler);

      await expect(service.handleEvent(mockEvent)).rejects.toThrow();
    });
  });

  describe('executeHandler with retry', () => {
    let mockEvent: BaseEvent;

    beforeEach(() => {
      service = new TestEventService('test-service', undefined, {
        maxRetries: 3,
        retryDelay: 10, 
      });

      mockEvent = {
        eventId: 'evt-123',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      };
    });

    it('should retry on failure', async () => {
      const handler = jest
        .fn()
        .mockRejectedValueOnce(new Error('Attempt 1'))
        .mockRejectedValueOnce(new Error('Attempt 2'))
        .mockResolvedValueOnce(undefined);

      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);

      expect(handler).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries exceeded', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Always fails'));
      service.on('TestEvent', handler);

      await expect(service.handleEvent(mockEvent)).rejects.toThrow('Always fails');
      expect(handler).toHaveBeenCalledTimes(3); 
    });

    it('should succeed on first attempt', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent(mockEvent);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('timeout handling', () => {
    let mockEvent: BaseEvent;

    beforeEach(() => {
      jest.useFakeTimers();
      service = new TestEventService('test-service', undefined, {
        timeout: 1000,
        maxRetries: 1, 
      });

      mockEvent = {
        eventId: 'evt-123',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      };
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should timeout slow handlers', async () => {
      const slowHandler = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 5000))
      );

      service.on('TestEvent', slowHandler);

      const handlePromise = service.handleEvent(mockEvent);

      jest.advanceTimersByTime(1100);

      await expect(handlePromise).rejects.toThrow('Operation timed out');
    });
  });

  describe('getTopicName', () => {
    beforeEach(() => {
      service = new TestEventService('test-service');
    });

    it('should convert camelCase to kebab-case', () => {
      expect(service.testGetTopicName('TransactionCreated')).toBe('transaction.created');
    });

    it('should handle single word event types', () => {
      expect(service.testGetTopicName('Created')).toBe('created');
    });

    it('should handle multiple capital letters', () => {
      expect(service.testGetTopicName('OrderPaymentCompleted')).toBe(
        'order.payment.completed'
      );
    });

    it('should handle already lowercase names', () => {
      expect(service.testGetTopicName('test')).toBe('test');
    });

    it('should handle mixed case', () => {
      expect(service.testGetTopicName('UserAccountCreated')).toBe('user.account.created');
    });
  });

  describe('cleanupProcessedEvents', () => {
    beforeEach(() => {
      service = new TestEventService('test-service');
    });

    it('should not cleanup when under threshold', async () => {

      for (let i = 0; i < 100; i++) {
        service['processedEvents'].add(`evt-${i}`);
      }

      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent({
        eventId: 'evt-new',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      });

      expect(service['processedEvents'].size).toBe(101);
    });

    it('should cleanup when over 10000 events', async () => {

      for (let i = 0; i < 10001; i++) {
        service['processedEvents'].add(`evt-${i}`);
      }

      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent({
        eventId: 'evt-new',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      });

      expect(service['processedEvents'].size).toBeLessThan(10000);
    });
  });

  describe('replayEvents', () => {
    beforeEach(() => {
      service = new TestEventService('test-service');
    });

    it('should accept date range for replay', async () => {
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');

      await expect(service.replayEvents(from, to)).resolves.not.toThrow();
    });

    it('should accept optional event types', async () => {
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');
      const types = ['TransactionCreated', 'TransactionCompleted'];

      await expect(service.replayEvents(from, to, types)).resolves.not.toThrow();
    });

    it('should work without event types filter', async () => {
      const from = new Date('2024-01-01');
      const to = new Date('2024-12-31');

      await expect(service.replayEvents(from, to)).resolves.not.toThrow();
    });
  });

  describe('getEventStatistics', () => {
    beforeEach(() => {
      service = new TestEventService('test-service');
    });

    it('should return zero processed events initially', () => {
      const stats = service.getEventStatistics();

      expect(stats.processedEvents).toBe(0);
      expect(stats.registeredHandlers).toEqual([]);
    });

    it('should count processed events', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      await service.handleEvent({
        eventId: 'evt-1',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      });

      const stats = service.getEventStatistics();
      expect(stats.processedEvents).toBe(1);
    });

    it('should count registered handlers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      service.on('Event1', handler1);
      service.on('Event1', handler2);
      service.on('Event2', handler3);

      const stats = service.getEventStatistics();

      expect(stats.registeredHandlers).toHaveLength(2);
      expect(stats.registeredHandlers).toContainEqual({
        eventType: 'Event1',
        handlerCount: 2,
      });
      expect(stats.registeredHandlers).toContainEqual({
        eventType: 'Event2',
        handlerCount: 1,
      });
    });

    it('should track multiple processed events', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      service.on('TestEvent', handler);

      for (let i = 0; i < 5; i++) {
        await service.handleEvent({
          eventId: `evt-${i}`,
          eventType: 'TestEvent',
          aggregateId: 'agg-123',
          aggregateType: 'TestAggregate',
          timestamp: new Date(),
          version: 1,
          payload: {},
        });
      }

      const stats = service.getEventStatistics();
      expect(stats.processedEvents).toBe(5);
    });
  });

  describe('getAggregateType', () => {
    it('should return correct aggregate type', () => {
      service = new TestEventService('test-service');

      expect(service['getAggregateType']()).toBe('TestAggregate');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      service = new TestEventService('test-service', mockKafkaClient);
    });

    it('should handle errors in local handlers without breaking flow', async () => {
      const failingHandler = jest.fn().mockRejectedValue(new Error('Handler failed'));
      const successHandler = jest.fn().mockResolvedValue(undefined);

      service.on('TestEvent', failingHandler);

      const event = await service.publishEvent('TestEvent', 'agg-123', {});

      expect(event).toBeDefined();
    });

    it('should propagate errors when handling external events', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Processing failed'));
      service.on('TestEvent', handler);

      const mockEvent: BaseEvent = {
        eventId: 'evt-123',
        eventType: 'TestEvent',
        aggregateId: 'agg-123',
        aggregateType: 'TestAggregate',
        timestamp: new Date(),
        version: 1,
        payload: {},
      };

      await expect(service.handleEvent(mockEvent)).rejects.toThrow('Processing failed');
    });
  });
});
