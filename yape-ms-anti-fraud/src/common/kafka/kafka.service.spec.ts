import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

/* Project */
import { KafkaService } from './kafka.service';

const mockProducer = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
};

const mockConsumer = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn().mockResolvedValue(undefined),
  run: jest.fn().mockResolvedValue(undefined),
};

let capturedEachMessage: ((payload: any) => Promise<void>) | undefined;

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => {
      return {
        producer: () => mockProducer,
        consumer: () => mockConsumer,
      };
    }),
  };
});

class MockConfigService {
  private readonly values: Record<string, string> = {
    KAFKA_URL: 'localhost:9092',
    KAFKA_TRANSACTIONS_CONSUMER_GROUP: 'test-group',
  };

  get<T = string>(key: string): T {
    return this.values[key] as unknown as T;
  }
}

const resetKafkaMocks = () => {
  mockProducer.connect.mockClear();
  mockProducer.disconnect.mockClear();
  mockProducer.send.mockClear();

  mockConsumer.connect.mockClear();
  mockConsumer.disconnect.mockClear();
  mockConsumer.subscribe.mockClear();
  mockConsumer.run.mockClear();

  mockConsumer.run.mockImplementation(
    (opts: { eachMessage: (p: any) => Promise<void> }) => {
      capturedEachMessage = opts.eachMessage;
    },
  );
};

describe('KafkaService', () => {
  let kafkaService: KafkaService;
  let configService: ConfigService;

  beforeEach(async () => {
    resetKafkaMocks();
    // configService = new MockConfigService() as unknown as ConfigService;
    // service = new KafkaService(configService);

    const app = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [KafkaService],
    })
      .overrideProvider(ConfigService)
      .useClass(MockConfigService)
      .compile();

    kafkaService = app.get(KafkaService);
    configService = app.get(ConfigService);

    app.useLogger(new Logger());
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
    expect(kafkaService).toBeDefined();
  });

  it('should connect producer and consumer on module init', () => {
    expect(mockProducer.connect).toHaveBeenCalledTimes(1);
    expect(mockConsumer.connect).toHaveBeenCalledTimes(1);
  });

  it('should register a listener for a topic and throw on duplicates', () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    kafkaService.registerListener('topic-A', handler);

    expect(() => kafkaService.registerListener('topic-A', handler)).toThrow(
      'Listener for topic "topic-A" already registered',
    );
  });

  it('onApplicationBootstrap should subscribe to registered topics and dispatch messages to handlers', async () => {
    const handlerA = jest.fn().mockResolvedValue(undefined);
    const handlerB = jest.fn().mockResolvedValue(undefined);

    kafkaService.registerListener('topic-A', handlerA);
    kafkaService.registerListener('topic-B', handlerB);

    await kafkaService.onApplicationBootstrap();

    expect(mockConsumer.subscribe).toHaveBeenCalledTimes(2);
    expect(mockConsumer.subscribe).toHaveBeenNthCalledWith(1, {
      topic: 'topic-A',
      fromBeginning: true,
    });
    expect(mockConsumer.subscribe).toHaveBeenNthCalledWith(2, {
      topic: 'topic-B',
      fromBeginning: true,
    });

    expect(typeof capturedEachMessage).toBe('function');
    await capturedEachMessage!({ topic: 'topic-A' });
    expect(handlerA).toHaveBeenCalledTimes(1);

    await capturedEachMessage!({ topic: 'topic-B' });
    expect(handlerB).toHaveBeenCalledTimes(1);
  });

  it('onApplicationBootstrap should warn when no handler is registered for a topic', async () => {
    const warnSpy = jest
      .spyOn(Logger.prototype as any, 'warn')
      .mockImplementation(console.log);

    await kafkaService.onApplicationBootstrap();

    await capturedEachMessage!({ topic: 'unknown-topic' });

    expect(warnSpy).toHaveBeenCalledWith(
      'No handler registered for topic: unknown-topic',
    );
  });

  it('publishToTopic should send message using the producer', async () => {
    await kafkaService.publishToTopic('topic-X', 'hello-world');

    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: 'topic-X',
      messages: [
        {
          value: 'hello-world',
        },
      ],
    });
  });

  it('onApplicationShutdown should disconnect producer and consumer', async () => {
    await kafkaService.onApplicationShutdown('SIGTERM');

    expect(mockProducer.disconnect).toHaveBeenCalledTimes(1);
    expect(mockConsumer.disconnect).toHaveBeenCalledTimes(1);
  });
});
