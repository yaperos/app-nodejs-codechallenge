import type { KafkaConsumerService, TransactionCreatedEvent } from '@app/common';
import { KafkaTopics, TransactionStatus } from '@app/common';
import type { EachMessagePayload } from 'kafkajs';
import type { IValidateTransactionUseCase } from '../../domain/ports/input/validate-transaction.use-case.interface';
import { TransactionCreatedConsumer } from './transaction-created.consumer';

describe('TransactionCreatedConsumer', () => {
    let consumer: TransactionCreatedConsumer;
    let mockKafkaConsumer: jest.Mocked<KafkaConsumerService>;
    let mockValidateUseCase: jest.Mocked<IValidateTransactionUseCase>;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockKafkaConsumer = {
            registerHandler: jest.fn(),
            subscribeAndRun: jest.fn().mockResolvedValue(undefined),
        } as any;

        mockValidateUseCase = {
            execute: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<IValidateTransactionUseCase>;

        consumer = new TransactionCreatedConsumer(mockKafkaConsumer, mockValidateUseCase);
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy.mockRestore();
    });

    describe('onModuleInit', () => {
        it('should register handler for transaction-created topic', async () => {
            await consumer.onModuleInit();

            expect(mockKafkaConsumer.registerHandler).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_CREATED,
                expect.any(Function),
            );
        });

        it('should subscribe to transaction-created topic', async () => {
            await consumer.onModuleInit();

            expect(mockKafkaConsumer.subscribeAndRun).toHaveBeenCalledWith([KafkaTopics.TRANSACTION_CREATED]);
        });

        it('should subscribe after registering handler', async () => {
            const callOrder: string[] = [];

            mockKafkaConsumer.registerHandler.mockImplementation(() => {
                callOrder.push('registerHandler');
            });

            mockKafkaConsumer.subscribeAndRun.mockImplementation(async () => {
                callOrder.push('subscribeAndRun');
            });

            await consumer.onModuleInit();

            expect(callOrder).toEqual(['registerHandler', 'subscribeAndRun']);
        });
    });

    describe('handleTransactionCreated', () => {
        const createPayload = (event: TransactionCreatedEvent): EachMessagePayload => {
            return {
                topic: KafkaTopics.TRANSACTION_CREATED,
                partition: 0,
                message: {
                    key: Buffer.from(event.transactionExternalId),
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

        it('should parse transaction event and call validate use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];
            expect(registeredHandler).toBeDefined();

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'debit-123',
                accountExternalIdCredit: 'credit-456',
                transferTypeId: 1,
                value: 500,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation-123',
                    causationId: 'causation-456',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                    version: '1.0.0',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledTimes(1);
        });

        it('should pass correct transaction ID to use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-external-id',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 1000,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                'txn-external-id',
                expect.any(Number),
                expect.any(String),
                expect.any(String),
                expect.any(Number),
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should pass transaction value to use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-value',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 2,
                value: 750.5,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                750.5,
                expect.any(String),
                expect.any(String),
                expect.any(Number),
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should pass account IDs to use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-accounts',
                accountExternalIdDebit: 'debit-account-789',
                accountExternalIdCredit: 'credit-account-012',
                transferTypeId: 1,
                value: 200,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                'debit-account-789',
                'credit-account-012',
                expect.any(Number),
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should pass transfer type ID to use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-type',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 3,
                value: 150,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                expect.any(String),
                expect.any(String),
                3,
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should convert createdAt string to Date object', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-date',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 100,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-06-15T14:30:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-06-15T14:30:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            const callArgs = mockValidateUseCase.execute.mock.calls[0];
            const passedDate = callArgs[5];

            expect(passedDate).toBeInstanceOf(Date);
            expect(passedDate.toISOString()).toBe('2024-06-15T14:30:00.000Z');
        });

        it('should pass metadata to use case', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-metadata',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 100,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation-abc',
                    causationId: 'causation-xyz',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                    version: '1.0.0',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                expect.any(String),
                expect.any(String),
                expect.any(Number),
                expect.any(Date),
                {
                    correlationId: 'correlation-abc',
                    causationId: 'causation-xyz',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                    version: '1.0.0',
                },
            );
        });

        it('should handle all parameters correctly', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-complete',
                accountExternalIdDebit: 'debit-complete',
                accountExternalIdCredit: 'credit-complete',
                transferTypeId: 2,
                value: 999.99,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-03-20T12:00:00.000Z',
                metadata: {
                    correlationId: 'correlation-complete',
                    causationId: 'causation-complete',
                    timestamp: '2024-03-20T12:00:00.000Z',
                    service: 'TransactionService',
                    version: '1.0.0',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                'txn-complete',
                999.99,
                'debit-complete',
                'credit-complete',
                2,
                new Date('2024-03-20T12:00:00.000Z'),
                event.metadata,
            );
        });

        it('should handle integer values', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-integer',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 1000,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                1000,
                expect.any(String),
                expect.any(String),
                expect.any(Number),
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should handle decimal values', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-decimal',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 123.45,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload = createPayload(event);
            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                expect.any(String),
                123.45,
                expect.any(String),
                expect.any(String),
                expect.any(Number),
                expect.any(Date),
                expect.any(Object),
            );
        });

        it('should handle different transfer types', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const transferTypes = [1, 2, 3];

            for (const typeId of transferTypes) {
                const event: TransactionCreatedEvent = {
                    transactionExternalId: `txn-type-${typeId}`,
                    accountExternalIdDebit: 'debit',
                    accountExternalIdCredit: 'credit',
                    transferTypeId: typeId,
                    value: 100,
                    transactionStatus: TransactionStatus.PENDING,
                    createdAt: '2024-01-01T10:00:00.000Z',
                    metadata: {
                        correlationId: 'correlation',
                        causationId: 'causation',
                        timestamp: '2024-01-01T10:00:00.000Z',
                        service: 'TransactionService',
                    },
                };

                const payload = createPayload(event);
                await registeredHandler(payload);

                expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(Number),
                    expect.any(String),
                    expect.any(String),
                    typeId,
                    expect.any(Date),
                    expect.any(Object),
                );
            }
        });

        it('should parse JSON message correctly', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-json',
                accountExternalIdDebit: 'debit-json',
                accountExternalIdCredit: 'credit-json',
                transferTypeId: 1,
                value: 555,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation-json',
                    causationId: 'causation-json',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const messageValue = Buffer.from(JSON.stringify(event));
            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_CREATED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-json'),
                    value: messageValue,
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await registeredHandler(payload);

            expect(mockValidateUseCase.execute).toHaveBeenCalledWith(
                'txn-json',
                555,
                'debit-json',
                'credit-json',
                1,
                expect.any(Date),
                event.metadata,
            );
        });
    });

    describe('error propagation', () => {
        it('should propagate use case errors', async () => {
            mockValidateUseCase.execute.mockRejectedValue(new Error('Validation error'));

            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-error',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 100,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: '2024-01-01T10:00:00.000Z',
                metadata: {
                    correlationId: 'correlation',
                    causationId: 'causation',
                    timestamp: '2024-01-01T10:00:00.000Z',
                    service: 'TransactionService',
                },
            };

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_CREATED,
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

            await expect(registeredHandler(payload)).rejects.toThrow('Validation error');
        });

        it('should handle null message value gracefully', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_CREATED,
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

            await registeredHandler(payload);

            expect(consoleErrorSpy).toHaveBeenCalledWith('Received message with null value');
            expect(mockValidateUseCase.execute).not.toHaveBeenCalled();
        });

        it('should propagate JSON parse errors', async () => {
            await consumer.onModuleInit();

            const registeredHandler = mockKafkaConsumer.registerHandler.mock.calls[0][1];

            const payload: EachMessagePayload = {
                topic: KafkaTopics.TRANSACTION_CREATED,
                partition: 0,
                message: {
                    key: Buffer.from('txn-invalid'),
                    value: Buffer.from('invalid json{'),
                    timestamp: '1234567890',
                    attributes: 0,
                    offset: '0',
                    headers: {},
                },
                heartbeat: async () => {},
                pause: () => () => {},
            };

            await expect(registeredHandler(payload)).rejects.toThrow();
        });
    });
});
