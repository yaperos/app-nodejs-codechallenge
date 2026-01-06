import type { KafkaConsumerService, TransactionStatusUpdatedEvent } from '@app/common';
import { KafkaTopics, TransactionStatus } from '@app/common';
import type { LoggerService } from '@app/observability';
import type { EachMessagePayload } from 'kafkajs';
import type { IUpdateTransactionStatusUseCase } from '../../domain/ports/input/update-transaction-status.use-case.interface';
import { TransactionStatusConsumer } from './transaction-status.consumer';

describe('TransactionStatusConsumer', () => {
    let consumer: TransactionStatusConsumer;
    let mockKafkaConsumer: jest.Mocked<KafkaConsumerService>;
    let mockUpdateUseCase: jest.Mocked<IUpdateTransactionStatusUseCase>;
    let mockLogger: jest.Mocked<LoggerService>;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockKafkaConsumer = {
            registerHandler: jest.fn(),
            subscribeAndRun: jest.fn().mockResolvedValue(undefined),
        } as any;

        mockUpdateUseCase = {
            execute: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<IUpdateTransactionStatusUseCase>;

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;

        consumer = new TransactionStatusConsumer(mockKafkaConsumer, mockUpdateUseCase, mockLogger);
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy.mockRestore();
    });

    describe('onModuleInit', () => {
        it('should register handlers for approved and rejected topics', async () => {
            await consumer.onModuleInit();

            expect(mockKafkaConsumer.registerHandler).toHaveBeenCalledTimes(2);
            expect(mockKafkaConsumer.registerHandler).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_APPROVED,
                expect.any(Function),
            );
            expect(mockKafkaConsumer.registerHandler).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_REJECTED,
                expect.any(Function),
            );
        });

        it('should subscribe to approved and rejected topics', async () => {
            await consumer.onModuleInit();

            expect(mockKafkaConsumer.subscribeAndRun).toHaveBeenCalledWith([
                KafkaTopics.TRANSACTION_APPROVED,
                KafkaTopics.TRANSACTION_REJECTED,
            ]);
        });

        it('should subscribe to topics after registering handlers', async () => {
            const callOrder: string[] = [];

            mockKafkaConsumer.registerHandler.mockImplementation(() => {
                callOrder.push('registerHandler');
            });

            mockKafkaConsumer.subscribeAndRun.mockImplementation(async () => {
                callOrder.push('subscribeAndRun');
            });

            await consumer.onModuleInit();

            expect(callOrder).toEqual(['registerHandler', 'registerHandler', 'subscribeAndRun']);
        });
    });

    describe('handleApproved', () => {
        const createApprovedPayload = (transactionId: string, correlationId: string): EachMessagePayload => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: transactionId,
                transactionStatus: TransactionStatus.APPROVED,
                metadata: {
                    correlationId,
                    causationId: 'causation-123',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                    version: '1.0.0',
                },
            };

            return {
                topic: KafkaTopics.TRANSACTION_APPROVED,
                partition: 0,
                message: {
                    key: Buffer.from(transactionId),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };
        };

        it('should process approved transaction event', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            expect(registeredHandler).toBeDefined();

            const payload = createApprovedPayload('txn-123', 'correlation-123');
            await registeredHandler?.(payload);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('txn-123', TransactionStatus.APPROVED);
        });

        it('should log received approved event', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const payload = createApprovedPayload('txn-456', 'correlation-456');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith('Received transaction-approved: txn-456', {
                correlationId: 'correlation-456',
                requestId: 'causation-123',
            });
        });

        it('should log successful update after approval', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const payload = createApprovedPayload('txn-789', 'correlation-789');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith('Transaction txn-789 marked as approved', {
                correlationId: 'correlation-789',
                requestId: 'causation-123',
            });
        });

        it('should extract context from event metadata', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const payload = createApprovedPayload('txn-context', 'context-correlation');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    correlationId: 'context-correlation',
                    requestId: 'causation-123',
                }),
            );
        });

        it('should handle null message value', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_APPROVED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-null'),
                    value: null as any,
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await registeredHandler?.(payload);

            expect(consoleErrorSpy).toHaveBeenCalledWith('Received message with null value');
            expect(mockUpdateUseCase.execute).not.toHaveBeenCalled();
        });

        it('should parse JSON message correctly', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-parse',
                transactionStatus: TransactionStatus.APPROVED,
                metadata: {
                    correlationId: 'parse-correlation',
                    causationId: 'parse-causation',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                },
            };

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_APPROVED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-parse'),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await registeredHandler?.(payload);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('txn-parse', TransactionStatus.APPROVED);
        });
    });

    describe('handleRejected', () => {
        const createRejectedPayload = (transactionId: string, correlationId: string): EachMessagePayload => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: transactionId,
                transactionStatus: TransactionStatus.REJECTED,
                metadata: {
                    correlationId,
                    causationId: 'causation-456',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                    version: '1.0.0',
                },
            };

            return {
                topic: KafkaTopics.TRANSACTION_REJECTED,
                partition: 0,
                message: {
                    key: Buffer.from(transactionId),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };
        };

        it('should process rejected transaction event', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            expect(registeredHandler).toBeDefined();

            const payload = createRejectedPayload('txn-rejected-1', 'correlation-rejected');
            await registeredHandler?.(payload);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('txn-rejected-1', TransactionStatus.REJECTED);
        });

        it('should log received rejected event', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const payload = createRejectedPayload('txn-rejected-2', 'correlation-reject-2');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith('Received transaction-rejected: txn-rejected-2', {
                correlationId: 'correlation-reject-2',
                requestId: 'causation-456',
            });
        });

        it('should log successful update after rejection', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const payload = createRejectedPayload('txn-rejected-3', 'correlation-reject-3');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith('Transaction txn-rejected-3 marked as rejected', {
                correlationId: 'correlation-reject-3',
                requestId: 'causation-456',
            });
        });

        it('should extract context from event metadata', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const payload = createRejectedPayload('txn-reject-context', 'reject-correlation');
            await registeredHandler?.(payload);

            expect(mockLogger.log).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    correlationId: 'reject-correlation',
                    requestId: 'causation-456',
                }),
            );
        });

        it('should handle null message value', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_REJECTED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-null-reject'),
                    value: null as any,
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await registeredHandler?.(payload);

            expect(consoleErrorSpy).toHaveBeenCalledWith('Received message with null value');
            expect(mockUpdateUseCase.execute).not.toHaveBeenCalled();
        });

        it('should parse JSON message correctly', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-parse-reject',
                transactionStatus: TransactionStatus.REJECTED,
                metadata: {
                    correlationId: 'parse-reject-correlation',
                    causationId: 'parse-reject-causation',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                },
            };

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_REJECTED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-parse-reject'),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await registeredHandler?.(payload);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('txn-parse-reject', TransactionStatus.REJECTED);
        });
    });

    describe('error propagation', () => {
        it('should propagate use case errors for approved transactions', async () => {
            mockUpdateUseCase.execute.mockRejectedValue(new Error('Database error'));

            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_APPROVED,
            )?.[1];

            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-error',
                transactionStatus: TransactionStatus.APPROVED,
                metadata: {
                    correlationId: 'error-correlation',
                    causationId: 'error-causation',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                },
            };

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_APPROVED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-error'),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await expect(registeredHandler?.(payload)).rejects.toThrow('Database error');
        });

        it('should propagate use case errors for rejected transactions', async () => {
            mockUpdateUseCase.execute.mockRejectedValue(new Error('Repository error'));

            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls.find(
                (call) => call[0] === KafkaTopics.TRANSACTION_REJECTED,
            )?.[1];

            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-error-reject',
                transactionStatus: TransactionStatus.REJECTED,
                metadata: {
                    correlationId: 'error-reject-correlation',
                    causationId: 'error-reject-causation',
                    timestamp: new Date().toISOString(),
                    service: 'AntiFraudService',
                },
            };

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_REJECTED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-error-reject'),
                    value: Buffer.from(JSON.stringify(event)),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await expect(registeredHandler?.(payload)).rejects.toThrow('Repository error');
        });
    });
});
