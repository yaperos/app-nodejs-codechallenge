import type { KafkaProducerService, RequestContext } from '@app/common';
import { KafkaTopics, TransactionStatus } from '@app/common';
import type {
    TransactionCreatedEvent,
    TransactionStatusUpdatedEvent,
} from '../../domain/ports/output/event-publisher.interface';
import { TransactionEventService } from './transaction-event.service';

jest.mock('node:crypto', () => ({
    randomUUID: jest.fn(() => 'mocked-uuid-12345'),
}));

describe('TransactionEventService', () => {
    let service: TransactionEventService;
    let mockKafkaProducer: jest.Mocked<KafkaProducerService>;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        mockKafkaProducer = {
            sendMessage: jest.fn().mockResolvedValue(undefined),
        } as any;

        service = new TransactionEventService(mockKafkaProducer);
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleLogSpy.mockRestore();
    });

    describe('publishTransactionCreated', () => {
        const event: TransactionCreatedEvent = {
            transactionExternalId: 'txn-123',
            accountExternalIdDebit: 'debit-account-123',
            accountExternalIdCredit: 'credit-account-456',
            transferTypeId: 1,
            value: 500.5,
            transactionStatus: TransactionStatus.PENDING,
            createdAt: new Date('2024-01-01T10:00:00Z'),
        };

        it('should publish transaction created event to Kafka', async () => {
            await service.publishTransactionCreated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledTimes(1);
            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_CREATED,
                'txn-123',
                expect.objectContaining({
                    transactionExternalId: 'txn-123',
                    accountExternalIdDebit: 'debit-account-123',
                    accountExternalIdCredit: 'credit-account-456',
                    transferTypeId: 1,
                    value: 500.5,
                    transactionStatus: TransactionStatus.PENDING,
                }),
            );
        });

        it('should convert createdAt Date to ISO string', async () => {
            await service.publishTransactionCreated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_CREATED,
                'txn-123',
                expect.objectContaining({
                    createdAt: '2024-01-01T10:00:00.000Z',
                }),
            );
        });

        it('should include event metadata with correlationId from context', async () => {
            const context: Partial<RequestContext> = {
                correlationId: 'correlation-123',
                requestId: 'request-456',
            };

            await service.publishTransactionCreated(event, context);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_CREATED,
                'txn-123',
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        correlationId: 'correlation-123',
                        causationId: 'request-456',
                        service: 'TransactionService',
                        version: '1.0.0',
                    }),
                }),
            );
        });

        it('should generate UUID for correlationId when context not provided', async () => {
            await service.publishTransactionCreated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_CREATED,
                'txn-123',
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        correlationId: 'mocked-uuid-12345',
                        causationId: 'mocked-uuid-12345',
                    }),
                }),
            );
        });

        it('should include timestamp in metadata', async () => {
            await service.publishTransactionCreated(event);

            const calls = mockKafkaProducer.sendMessage.mock.calls[0];
            const kafkaEvent = calls[2] as any;

            expect(kafkaEvent.metadata.timestamp).toBeDefined();
            expect(typeof kafkaEvent.metadata.timestamp).toBe('string');
        });

        it('should log published event', async () => {
            const context: Partial<RequestContext> = {
                correlationId: 'test-correlation',
            };

            await service.publishTransactionCreated(event, context);

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📤 Published transaction-created'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('txn-123'));
        });

        it('should handle partial context', async () => {
            const context: Partial<RequestContext> = {
                correlationId: 'correlation-only',
            };

            await service.publishTransactionCreated(event, context);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        correlationId: 'correlation-only',
                        causationId: 'mocked-uuid-12345',
                    }),
                }),
            );
        });
    });

    describe('publishTransactionStatusUpdated', () => {
        it('should publish to TRANSACTION_APPROVED topic when status is approved', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-456',
                transactionStatus: TransactionStatus.APPROVED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_APPROVED,
                'txn-456',
                expect.objectContaining({
                    transactionExternalId: 'txn-456',
                    transactionStatus: TransactionStatus.APPROVED,
                }),
            );
        });

        it('should publish to TRANSACTION_REJECTED topic when status is rejected', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-789',
                transactionStatus: TransactionStatus.REJECTED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                KafkaTopics.TRANSACTION_REJECTED,
                'txn-789',
                expect.objectContaining({
                    transactionExternalId: 'txn-789',
                    transactionStatus: TransactionStatus.REJECTED,
                }),
            );
        });

        it('should include metadata for approved status', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-approved',
                transactionStatus: TransactionStatus.APPROVED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        correlationId: 'mocked-uuid-12345',
                        causationId: 'mocked-uuid-12345',
                        service: 'TransactionService',
                        version: '1.0.0',
                    }),
                }),
            );
        });

        it('should include metadata for rejected status', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-rejected',
                transactionStatus: TransactionStatus.REJECTED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                expect.objectContaining({
                    metadata: expect.objectContaining({
                        timestamp: expect.any(String),
                    }),
                }),
            );
        });

        it('should log published approved event', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-log-test',
                transactionStatus: TransactionStatus.APPROVED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📤 Published'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('txn-log-test'));
        });

        it('should log published rejected event', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-log-reject',
                transactionStatus: TransactionStatus.REJECTED,
            };

            await service.publishTransactionStatusUpdated(event);

            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('📤 Published'));
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('txn-log-reject'));
        });
    });

    describe('error handling', () => {
        it('should propagate Kafka producer errors for transaction created', async () => {
            const event: TransactionCreatedEvent = {
                transactionExternalId: 'txn-error',
                accountExternalIdDebit: 'debit',
                accountExternalIdCredit: 'credit',
                transferTypeId: 1,
                value: 100,
                transactionStatus: TransactionStatus.PENDING,
                createdAt: new Date(),
            };

            mockKafkaProducer.sendMessage.mockRejectedValue(new Error('Kafka connection error'));

            await expect(service.publishTransactionCreated(event)).rejects.toThrow('Kafka connection error');
        });

        it('should propagate Kafka producer errors for status updated', async () => {
            const event: TransactionStatusUpdatedEvent = {
                transactionExternalId: 'txn-error-status',
                transactionStatus: TransactionStatus.APPROVED,
            };

            mockKafkaProducer.sendMessage.mockRejectedValue(new Error('Kafka timeout'));

            await expect(service.publishTransactionStatusUpdated(event)).rejects.toThrow('Kafka timeout');
        });
    });
});
