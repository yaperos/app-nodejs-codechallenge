import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from './kafka-consumer.service';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

jest.mock('kafkajs');

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let configService: jest.Mocked<ConfigService>;
  let mockKafka: jest.Mocked<Kafka>;
  let mockConsumer: jest.Mocked<Consumer>;

  beforeEach(async () => {

    mockConsumer = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      seek: jest.fn().mockResolvedValue(undefined),
      commitOffsets: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Consumer>;

    mockKafka = {
      consumer: jest.fn().mockReturnValue(mockConsumer),
    } as unknown as jest.Mocked<Kafka>;

    (Kafka as jest.MockedClass<typeof Kafka>).mockImplementation(() => mockKafka);

    configService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          'KAFKA_BROKERS': 'localhost:9092',
          'KAFKA_CLIENT_ID': 'yape-transaction-service',
          'KAFKA_DLQ_TOPIC': 'yape.transactions.dlq',
        };
        return config[key] || defaultValue;
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaConsumerService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize Kafka with correct config', () => {
      expect(Kafka).toHaveBeenCalledWith({
        clientId: 'yape-transaction-service',
        brokers: ['localhost:9092'],
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
        connectionTimeout: 3000,
        requestTimeout: 30000,
      });
    });

    it('should parse multiple brokers from comma-separated string', () => {
      const multibrokerConfig = {
        get: jest.fn((key: string, defaultValue?: string) => {
          const config: Record<string, string> = {
            'KAFKA_BROKERS': 'broker1:9092,broker2:9092,broker3:9092',
            'KAFKA_CLIENT_ID': 'test-service',
          };
          return config[key] || defaultValue || '';
        }),
      } as unknown as jest.Mocked<ConfigService>;

      const newService = new KafkaConsumerService(multibrokerConfig);

      expect(Kafka).toHaveBeenCalledWith(
        expect.objectContaining({
          brokers: ['broker1:9092', 'broker2:9092', 'broker3:9092'],
        })
      );
    });
  });

  describe('createConsumer', () => {
    it('should create a consumer with correct configuration', async () => {
      const groupId = 'test-group';
      const topics = ['test-topic-1', 'test-topic-2'];

      await service.createConsumer(groupId, topics);

      expect(mockKafka.consumer).toHaveBeenCalledWith({
        groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxBytesPerPartition: 1048576,
      });

      expect(mockConsumer.connect).toHaveBeenCalled();
      expect(mockConsumer.subscribe).toHaveBeenCalledWith({
        topics,
        fromBeginning: false,
      });
    });

    it('should store consumer in internal map', async () => {
      const groupId = 'test-group';
      const topics = ['test-topic'];

      await service.createConsumer(groupId, topics);

      await expect(service.startConsumer(groupId, async () => {})).resolves.not.toThrow();
    });

    it('should handle connection errors', async () => {
      mockConsumer.connect.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(
        service.createConsumer('test-group', ['test-topic'])
      ).rejects.toThrow('Connection failed');
    });
  });

  describe('startConsumer', () => {
    const groupId = 'test-group';
    const topics = ['test-topic'];

    beforeEach(async () => {
      await service.createConsumer(groupId, topics);
    });

    it('should throw error if consumer not found', async () => {
      await expect(
        service.startConsumer('non-existent-group', async () => {})
      ).rejects.toThrow('Consumer non-existent-group not found');
    });

    it('should start consumer with message handler', async () => {
      const messageHandler = jest.fn().mockResolvedValue(undefined);

      await service.startConsumer(groupId, messageHandler);

      expect(mockConsumer.run).toHaveBeenCalledWith({
        autoCommit: false,
        eachMessage: expect.any(Function),
      });
    });

    it('should process messages successfully', async () => {
      const messageHandler = jest.fn().mockResolvedValue(undefined);
      let eachMessageHandler: (payload: EachMessagePayload) => Promise<void>;

      mockConsumer.run.mockImplementation(async (config: any) => {
        eachMessageHandler = config.eachMessage;
      });

      await service.startConsumer(groupId, messageHandler);

      const mockPayload: EachMessagePayload = {
        topic: 'test-topic',
        partition: 0,
        message: {
          offset: '123',
          key: Buffer.from('key'),
          value: Buffer.from('value'),
          timestamp: '1234567890',
          attributes: 0,
          headers: {},
        },
        heartbeat: async () => {},
        pause: () => () => {},
      };

      await eachMessageHandler!(mockPayload);

      expect(messageHandler).toHaveBeenCalledWith(mockPayload);
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        {
          topic: 'test-topic',
          partition: 0,
          offset: '124',
        },
      ]);
    });

    it('should handle message processing errors', async () => {
      const messageHandler = jest.fn().mockRejectedValue(new Error('Processing failed'));
      let eachMessageHandler: (payload: EachMessagePayload) => Promise<void>;

      mockConsumer.run.mockImplementation(async (config: any) => {
        eachMessageHandler = config.eachMessage;
      });

      await service.startConsumer(groupId, messageHandler);

      const mockPayload: EachMessagePayload = {
        topic: 'test-topic',
        partition: 0,
        message: {
          offset: '123',
          key: Buffer.from('key'),
          value: Buffer.from('value'),
          timestamp: '1234567890',
          attributes: 0,
          headers: {},
        },
        heartbeat: async () => {},
        pause: () => () => {},
      };

      await expect(eachMessageHandler!(mockPayload)).resolves.not.toThrow();

      expect(messageHandler).toHaveBeenCalledWith(mockPayload);
      expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
    });

    it('should handle messages with retry headers', async () => {
      const messageHandler = jest.fn().mockRejectedValue(new Error('Retry test'));
      let eachMessageHandler: (payload: EachMessagePayload) => Promise<void>;

      mockConsumer.run.mockImplementation(async (config: any) => {
        eachMessageHandler = config.eachMessage;
      });

      await service.startConsumer(groupId, messageHandler);

      const mockPayload: EachMessagePayload = {
        topic: 'test-topic',
        partition: 0,
        message: {
          offset: '123',
          key: Buffer.from('key'),
          value: Buffer.from('value'),
          timestamp: '1234567890',
          attributes: 0,
          headers: {
            'retry-count': Buffer.from('2'),
          },
        },
        heartbeat: async () => {},
        pause: () => () => {},
      };

      await eachMessageHandler!(mockPayload);

      expect(messageHandler).toHaveBeenCalled();
    });
  });

  describe('pauseConsumer', () => {
    const groupId = 'test-group';
    const topics = ['topic-1', 'topic-2'];

    beforeEach(async () => {
      await service.createConsumer(groupId, topics);
    });

    it('should throw error if consumer not found', async () => {
      await expect(
        service.pauseConsumer('non-existent-group')
      ).rejects.toThrow('Consumer non-existent-group not found');
    });

    it('should pause specific topics', async () => {
      await service.pauseConsumer(groupId, ['topic-1']);

      expect(mockConsumer.pause).toHaveBeenCalledWith([{ topic: 'topic-1' }]);
    });

    it('should pause all topics when no topics specified', async () => {
      await service.pauseConsumer(groupId);

      expect(mockConsumer.pause).toHaveBeenCalledWith([
        { topic: 'topic-1' },
        { topic: 'topic-2' },
      ]);
    });
  });

  describe('resumeConsumer', () => {
    const groupId = 'test-group';
    const topics = ['topic-1', 'topic-2'];

    beforeEach(async () => {
      await service.createConsumer(groupId, topics);
    });

    it('should throw error if consumer not found', async () => {
      await expect(
        service.resumeConsumer('non-existent-group')
      ).rejects.toThrow('Consumer non-existent-group not found');
    });

    it('should resume specific topics', async () => {
      await service.resumeConsumer(groupId, ['topic-1']);

      expect(mockConsumer.resume).toHaveBeenCalledWith([{ topic: 'topic-1' }]);
    });

    it('should resume all topics when no topics specified', async () => {
      await service.resumeConsumer(groupId);

      expect(mockConsumer.resume).toHaveBeenCalledWith([
        { topic: 'topic-1' },
        { topic: 'topic-2' },
      ]);
    });
  });

  describe('seekToBeginning', () => {
    const groupId = 'test-group';
    const topics = ['test-topic'];

    beforeEach(async () => {
      await service.createConsumer(groupId, topics);
    });

    it('should throw error if consumer not found', async () => {
      await expect(
        service.seekToBeginning('non-existent-group', topics)
      ).rejects.toThrow('Consumer non-existent-group not found');
    });

    it('should seek to beginning of topic', async () => {
      await service.seekToBeginning(groupId, ['test-topic']);

      expect(mockConsumer.seek).toHaveBeenCalledWith({
        topic: 'test-topic',
        partition: 0,
        offset: '0',
      });
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect all consumers', async () => {
      await service.createConsumer('group-1', ['topic-1']);
      await service.createConsumer('group-2', ['topic-2']);

      await service.onModuleDestroy();

      expect(mockConsumer.disconnect).toHaveBeenCalledTimes(2);
    });

    it('should handle disconnect errors gracefully', async () => {
      await service.createConsumer('test-group', ['test-topic']);
      mockConsumer.disconnect.mockRejectedValueOnce(new Error('Disconnect failed'));

      await expect(service.onModuleDestroy()).resolves.not.toThrow();
    });

    it('should log successful disconnections', async () => {
      await service.createConsumer('test-group', ['test-topic']);

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.onModuleDestroy();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Consumer test-group disconnected')
      );
    });
  });
});
