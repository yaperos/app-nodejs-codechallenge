import type { Producer } from 'kafkajs';
import type { KafkaModuleOptions } from './kafka.config';
import { KafkaProducerService } from './kafka.producer';

jest.mock('./kafka.config', () => ({
    createKafkaClient: jest.fn(() => ({
        producer: jest.fn(() => mockProducer),
    })),
}));

let mockProducer: jest.Mocked<Producer>;

describe('KafkaProducerService', () => {
    let service: KafkaProducerService;
    let consoleLogSpy: jest.SpyInstance;

    const mockOptions: KafkaModuleOptions = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
    };

    beforeEach(() => {
        mockProducer = {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
            send: jest.fn().mockResolvedValue(undefined),
        } as any;

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        service = new KafkaProducerService(mockOptions);
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleLogSpy.mockRestore();
    });

    describe('onModuleInit', () => {
        it('should connect to Kafka producer', async () => {
            await service.onModuleInit();

            expect(mockProducer.connect).toHaveBeenCalledTimes(1);
        });

        it('should log successful connection', async () => {
            await service.onModuleInit();

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Kafka Producer connected'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('test-client'));
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect from Kafka producer', async () => {
            await service.onModuleDestroy();

            expect(mockProducer.disconnect).toHaveBeenCalledTimes(1);
        });

        it('should log disconnection', async () => {
            await service.onModuleDestroy();

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Kafka Producer disconnected'));
        });
    });

    describe('send', () => {
        it('should send a producer record', async () => {
            const record = {
                topic: 'test-topic',
                messages: [
                    {
                        key: 'key-1',
                        value: 'value-1',
                    },
                ],
            };

            await service.send(record);

            expect(mockProducer.send).toHaveBeenCalledWith(record);
        });
    });

    describe('sendMessage', () => {
        it('should send a message with JSON serialization', async () => {
            const topic = 'test-topic';
            const key = 'test-key';
            const value = { id: 1, name: 'test' };

            await service.sendMessage(topic, key, value);

            expect(mockProducer.send).toHaveBeenCalledWith({
                topic: 'test-topic',
                messages: [
                    {
                        key: 'test-key',
                        value: JSON.stringify(value),
                    },
                ],
            });
        });

        it('should handle string values', async () => {
            await service.sendMessage('topic', 'key', 'simple-string');

            expect(mockProducer.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    messages: [
                        expect.objectContaining({
                            value: '"simple-string"',
                        }),
                    ],
                }),
            );
        });

        it('should handle number values', async () => {
            await service.sendMessage('topic', 'key', 12345);

            expect(mockProducer.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    messages: [
                        expect.objectContaining({
                            value: '12345',
                        }),
                    ],
                }),
            );
        });
    });
});
