import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { KafkaProducerService } from './kafka-producer.service';

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;
  let mockKafkaClient: {
    connect: jest.Mock;
    emit: jest.Mock;
  };
  let mockConfigService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    mockKafkaClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn().mockReturnValue(of({})),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          KAFKA_TRANSACTION_TOPIC: 'test.transactions',
          KAFKA_EVENTS_TOPIC: 'test.events',
          KAFKA_DLQ_TOPIC: 'test.dlq',
          KAFKA_BROKERS: 'localhost:9092,localhost:9093',
        };
        return config[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_CLIENT',
          useValue: mockKafkaClient,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should connect to Kafka on module initialization', async () => {
      await service.onModuleInit();

      expect(mockKafkaClient.connect).toHaveBeenCalled();
    });
  });

  describe('publishTransaction', () => {
    it('should publish transaction to Kafka topic', async () => {
      const transactionId = 'txn-123';
      const data = {
        amount: 100,
        currency: 'PEN',
      };

      await service.publishTransaction(transactionId, data);

      expect(mockKafkaClient.emit).toHaveBeenCalledWith(
        'test.transactions',
        expect.objectContaining({
          key: transactionId,
          value: expect.any(String),
          headers: expect.objectContaining({
            'correlation-id': transactionId,
            'event-type': 'transaction',
          }),
        })
      );
    });

    it('should include timestamp in published message', async () => {
      const beforePublish = Date.now();
      await service.publishTransaction('txn-123', { amount: 100 });
      const afterPublish = Date.now();

      const emittedValue = JSON.parse(mockKafkaClient.emit.mock.calls[0][1].value);
      const messageTimestamp = new Date(emittedValue.timestamp).getTime();

      expect(messageTimestamp).toBeGreaterThanOrEqual(beforePublish);
      expect(messageTimestamp).toBeLessThanOrEqual(afterPublish);
    });

    it('should serialize data to JSON string', async () => {
      const data = { amount: 500, currency: 'USD' };
      await service.publishTransaction('txn-456', data);

      const message = mockKafkaClient.emit.mock.calls[0][1];
      const parsedValue = JSON.parse(message.value);

      expect(parsedValue.amount).toBe(500);
      expect(parsedValue.currency).toBe('USD');
      expect(parsedValue.timestamp).toBeDefined();
    });

    it('should send to DLQ on publish failure', async () => {
      const error = new Error('Kafka connection lost');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      const data = { amount: 100 };

      await expect(
        service.publishTransaction('txn-fail', data)
      ).rejects.toThrow('Kafka connection lost');

      expect(mockKafkaClient.emit).toHaveBeenCalledTimes(2);
      expect(mockKafkaClient.emit).toHaveBeenNthCalledWith(
        2,
        'test.dlq',
        expect.objectContaining({
          key: 'txn-fail',
          headers: expect.objectContaining({
            'original-topic': 'test.transactions',
            'error-type': 'publish-failure',
          }),
        })
      );
    });
  });

  describe('publishEvent', () => {
    it('should publish event to events topic', async () => {
      const eventType = 'TransactionCreated';
      const eventData = { transactionId: 'txn-123' };

      await service.publishEvent(eventType, eventData);

      expect(mockKafkaClient.emit).toHaveBeenCalledWith(
        'test.events',
        expect.objectContaining({
          key: expect.any(String),
          value: expect.any(String),
          headers: expect.objectContaining({
            'event-type': eventType,
            'event-id': expect.any(String),
          }),
        })
      );
    });

    it('should generate unique event IDs', async () => {
      await service.publishEvent('Event1', { data: 1 });
      await service.publishEvent('Event2', { data: 2 });

      const eventId1 = mockKafkaClient.emit.mock.calls[0][1].headers['event-id'];
      const eventId2 = mockKafkaClient.emit.mock.calls[1][1].headers['event-id'];

      expect(eventId1).not.toBe(eventId2);
    });

    it('should include eventId, eventType, data, and timestamp in message', async () => {
      const eventType = 'UserCreated';
      const eventData = { userId: '123' };

      await service.publishEvent(eventType, eventData);

      const message = mockKafkaClient.emit.mock.calls[0][1];
      const parsedValue = JSON.parse(message.value);

      expect(parsedValue.eventId).toBeDefined();
      expect(parsedValue.eventType).toBe(eventType);
      expect(parsedValue.data).toEqual(eventData);
      expect(parsedValue.timestamp).toBeDefined();
    });

    it('should throw error on publish failure', async () => {
      const error = new Error('Broker not available');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      await expect(
        service.publishEvent('TestEvent', {})
      ).rejects.toThrow('Broker not available');
    });
  });

  describe('publishBatch', () => {
    it('should publish multiple messages', async () => {
      const messages = [
        { key: 'msg-1', value: { data: 1 } },
        { key: 'msg-2', value: { data: 2 } },
        { key: 'msg-3', value: { data: 3 } },
      ];

      await service.publishBatch(messages);

      expect(mockKafkaClient.emit).toHaveBeenCalledTimes(3);
    });

    it('should add batch headers to all messages', async () => {
      const messages = [
        { key: 'msg-1', value: { data: 1 } },
        { key: 'msg-2', value: { data: 2 } },
      ];

      await service.publishBatch(messages);

      const firstCall = mockKafkaClient.emit.mock.calls[0][1];
      const secondCall = mockKafkaClient.emit.mock.calls[1][1];

      expect(firstCall.headers['batch-id']).toBeDefined();
      expect(firstCall.headers['batch-size']).toBe('2');
      expect(secondCall.headers['batch-id']).toBe(firstCall.headers['batch-id']);
      expect(secondCall.headers['batch-size']).toBe('2');
    });

    it('should serialize batch message values', async () => {
      const messages = [{ key: 'test', value: { amount: 100 } }];

      await service.publishBatch(messages);

      const message = mockKafkaClient.emit.mock.calls[0][1];
      const parsedValue = JSON.parse(message.value);

      expect(parsedValue.amount).toBe(100);
    });

    it('should throw error on batch publish failure', async () => {
      const error = new Error('Batch publish failed');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      const messages = [{ key: 'test', value: {} }];

      await expect(service.publishBatch(messages)).rejects.toThrow('Batch publish failed');
    });
  });

  describe('getTopicMetadata', () => {
    it('should return configured topics', async () => {
      const metadata = await service.getTopicMetadata();

      expect(metadata.topics).toEqual([
        'test.transactions',
        'test.events',
        'test.dlq',
      ]);
    });

    it('should return configured brokers', async () => {
      const metadata = await service.getTopicMetadata();

      expect(metadata.brokers).toEqual(['localhost:9092', 'localhost:9093']);
    });

    it('should split brokers by comma', async () => {
      const metadata = await service.getTopicMetadata();

      expect(Array.isArray(metadata.brokers)).toBe(true);
      expect(metadata.brokers.length).toBe(2);
    });
  });

  describe('Configuration', () => {
    it('should use configured transaction topic', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'KAFKA_TRANSACTION_TOPIC',
        'yape.transactions'
      );
    });

    it('should use configured events topic', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'KAFKA_EVENTS_TOPIC',
        'yape.events'
      );
    });

    it('should use configured DLQ topic', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'KAFKA_DLQ_TOPIC',
        'yape.transactions.dlq'
      );
    });
  });

  describe('DLQ handling', () => {
    it('should include original data in DLQ message', async () => {
      const error = new Error('Test error');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      const data = { amount: 500, retryCount: 2 };

      try {
        await service.publishTransaction('txn-dlq', data);
      } catch (e) {

      }

      const dlqCall = mockKafkaClient.emit.mock.calls[1];
      const dlqMessage = JSON.parse(dlqCall[1].value);

      expect(dlqMessage.originalData).toEqual(data);
      expect(dlqMessage.error).toBe('Test error');
      expect(dlqMessage.failedAt).toBeDefined();
    });

    it('should extract retryCount from data if available', async () => {
      const error = new Error('Test error');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      const data = { amount: 100, retryCount: 5 };

      try {
        await service.publishTransaction('txn-retry', data);
      } catch (e) {

      }

      const dlqMessage = JSON.parse(mockKafkaClient.emit.mock.calls[1][1].value);
      expect(dlqMessage.retryCount).toBe(5);
    });

    it('should default retryCount to 0 if not in data', async () => {
      const error = new Error('Test error');
      mockKafkaClient.emit.mockReturnValueOnce(throwError(() => error));

      const data = { amount: 100 };

      try {
        await service.publishTransaction('txn-no-retry', data);
      } catch (e) {

      }

      const dlqMessage = JSON.parse(mockKafkaClient.emit.mock.calls[1][1].value);
      expect(dlqMessage.retryCount).toBe(0);
    });
  });
});
