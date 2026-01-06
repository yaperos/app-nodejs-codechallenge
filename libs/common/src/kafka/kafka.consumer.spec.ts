import type { Consumer, EachMessagePayload } from 'kafkajs';
import type { KafkaModuleOptions } from './kafka.config';
import { KafkaConsumerService, type MessageHandler } from './kafka.consumer';

jest.mock('./kafka.config', () => ({
    createKafkaClient: jest.fn(() => ({
        consumer: jest.fn(() => mockConsumer),
    })),
}));

let mockConsumer: jest.Mocked<Consumer>;
let capturedEachMessage: ((payload: EachMessagePayload) => Promise<void>) | undefined;

describe('KafkaConsumerService', () => {
    let service: KafkaConsumerService;
    let consoleLogSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;

    const mockOptions: KafkaModuleOptions = {
        clientId: 'test-consumer-client',
        brokers: ['localhost:9092'],
        consumerConfig: {
            groupId: 'test-group',
        },
    };

    beforeEach(() => {
        capturedEachMessage = undefined;

        mockConsumer = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            subscribe: jest.fn().mockResolvedValue(undefined),
            run: jest.fn().mockImplementation((config) => {
                capturedEachMessage = config.eachMessage;
                return Promise.resolve();
            }),
        } as any;

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        service = new KafkaConsumerService(mockOptions);
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleLogSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    describe('constructor', () => {
        it('should throw error if consumerConfig is not provided', () => {
            const invalidOptions: KafkaModuleOptions = {
                clientId: 'test',
                brokers: ['localhost:9092'],
            };

            expect(() => new KafkaConsumerService(invalidOptions)).toThrow(
                'consumerConfig is required for KafkaConsumerService',
            );
        });
    });

    describe('onModuleInit', () => {
        it('should connect to Kafka consumer', async () => {
            await service.onModuleInit();

            expect(mockConsumer.connect).toHaveBeenCalledTimes(1);
        });

        it('should log successful connection', async () => {
            await service.onModuleInit();

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Kafka Consumer connected'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('test-consumer-client'));
        });

        it('should not start consuming if no handlers registered', async () => {
            await service.onModuleInit();

            expect(mockConsumer.run).not.toHaveBeenCalled();
        });

        it('should start consuming if handlers are registered', async () => {
            const handler = jest.fn();
            service.registerHandler('test-topic', handler);

            await service.onModuleInit();

            expect(mockConsumer.run).toHaveBeenCalled();
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect from Kafka consumer', async () => {
            await service.onModuleDestroy();

            expect(mockConsumer.disconnect).toHaveBeenCalledTimes(1);
        });

        it('should log disconnection', async () => {
            await service.onModuleDestroy();

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Kafka Consumer disconnected'));
        });
    });

    describe('registerHandler', () => {
        it('should register a message handler for a topic', () => {
            const handler: MessageHandler = jest.fn();

            service.registerHandler('test-topic', handler);

            // Verificar que se registró internamente
            expect(() => service.registerHandler('test-topic', handler)).not.toThrow();
        });

        it('should allow registering multiple handlers for different topics', () => {
            const handler1: MessageHandler = jest.fn();
            const handler2: MessageHandler = jest.fn();

            service.registerHandler('topic-1', handler1);
            service.registerHandler('topic-2', handler2);

            expect(() => service.registerHandler('topic-1', handler1)).not.toThrow();
            expect(() => service.registerHandler('topic-2', handler2)).not.toThrow();
        });
    });

    describe('subscribe', () => {
        it('should subscribe to a single topic', async () => {
            await service.subscribe(['test-topic']);

            expect(mockConsumer.subscribe).toHaveBeenCalledWith({
                topic: 'test-topic',
                fromBeginning: false,
            });
        });

        it('should subscribe to multiple topics', async () => {
            await service.subscribe(['topic-1', 'topic-2', 'topic-3']);

            expect(mockConsumer.subscribe).toHaveBeenCalledTimes(3);
            expect(mockConsumer.subscribe).toHaveBeenCalledWith({
                topic: 'topic-1',
                fromBeginning: false,
            });
            expect(mockConsumer.subscribe).toHaveBeenCalledWith({
                topic: 'topic-2',
                fromBeginning: false,
            });
        });

        it('should log subscription for each topic', async () => {
            await service.subscribe(['topic-1', 'topic-2']);

            expect(consoleLogSpy).toHaveBeenCalledWith('📥 Subscribed to topic: topic-1');
            expect(consoleLogSpy).toHaveBeenCalledWith('📥 Subscribed to topic: topic-2');
        });
    });

    describe('subscribeAndRun', () => {
        it('should subscribe and start consuming', async () => {
            const handler = jest.fn();
            service.registerHandler('test-topic', handler);

            await service.subscribeAndRun(['test-topic']);

            expect(mockConsumer.subscribe).toHaveBeenCalled();
            expect(mockConsumer.run).toHaveBeenCalled();
        });

        it('should subscribe to multiple topics and start consuming', async () => {
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            service.registerHandler('topic-1', handler1);
            service.registerHandler('topic-2', handler2);

            await service.subscribeAndRun(['topic-1', 'topic-2']);

            expect(mockConsumer.subscribe).toHaveBeenCalledTimes(2);
            expect(mockConsumer.run).toHaveBeenCalled();
        });
    });

    describe('message handling', () => {
        it('should call registered handler when message is received', async () => {
            const handler = jest.fn().mockResolvedValue(undefined);
            service.registerHandler('test-topic', handler);

            await service.subscribeAndRun(['test-topic']);

            const mockPayload: EachMessagePayload = {
                topic: 'test-topic',
                partition: 0,
                message: {
                    key: Buffer.from('key'),
                    value: Buffer.from('value'),
                    timestamp: '123',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await capturedEachMessage?.(mockPayload);

            expect(handler).toHaveBeenCalledWith(mockPayload);
        });

        it('should warn when no handler is registered for a topic', async () => {
            const handler = jest.fn();
            service.registerHandler('registered-topic', handler);

            await service.subscribeAndRun(['registered-topic']);

            const mockPayload: EachMessagePayload = {
                topic: 'unregistered-topic',
                partition: 0,
                message: {
                    key: Buffer.from('key'),
                    value: Buffer.from('value'),
                    timestamp: '123',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await capturedEachMessage?.(mockPayload);

            expect(consoleWarnSpy).toHaveBeenCalledWith('No handler registered for topic: unregistered-topic');
            expect(handler).not.toHaveBeenCalled();
        });

        it('should handle multiple messages for different topics', async () => {
            const handler1 = jest.fn().mockResolvedValue(undefined);
            const handler2 = jest.fn().mockResolvedValue(undefined);

            service.registerHandler('topic-1', handler1);
            service.registerHandler('topic-2', handler2);

            await service.subscribeAndRun(['topic-1', 'topic-2']);

            const payload1: EachMessagePayload = {
                topic: 'topic-1',
                partition: 0,
                message: {
                    key: Buffer.from('key1'),
                    value: Buffer.from('value1'),
                    timestamp: '123',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            const payload2: EachMessagePayload = {
                topic: 'topic-2',
                partition: 0,
                message: {
                    key: Buffer.from('key2'),
                    value: Buffer.from('value2'),
                    timestamp: '456',
                    attributes: 0,
                    offset: '1',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await capturedEachMessage?.(payload1);
            await capturedEachMessage?.(payload2);

            expect(handler1).toHaveBeenCalledWith(payload1);
            expect(handler2).toHaveBeenCalledWith(payload2);
        });
    });
});
