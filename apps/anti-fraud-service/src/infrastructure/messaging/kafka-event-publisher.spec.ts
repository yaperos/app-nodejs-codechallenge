import type { KafkaProducerService } from '@app/common';
import { KafkaTopics, TransactionStatus } from '@app/common';
import { KafkaEventPublisher } from './kafka-event-publisher';

describe('KafkaEventPublisher', () => {
    let publisher: KafkaEventPublisher;
    let mockKafkaProducer: jest.Mocked<KafkaProducerService>;

    beforeEach(() => {
        mockKafkaProducer = {
            sendMessage: jest.fn().mockResolvedValue(undefined),
        } as any;

        publisher = new KafkaEventPublisher(mockKafkaProducer);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('publishResult', () => {
        describe('when status is approved', () => {
            it('should publish to TRANSACTION_APPROVED topic', async () => {
                await publisher.publishResult(
                    'txn-123',
                    TransactionStatus.APPROVED,
                    ['No fraud detected'],
                    [],
                    'correlation-123',
                    'causation-456',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    KafkaTopics.TRANSACTION_APPROVED,
                    'txn-123',
                    expect.any(Object),
                );
            });

            it('should include transaction details in event', async () => {
                await publisher.publishResult(
                    'txn-approved',
                    TransactionStatus.APPROVED,
                    ['All checks passed'],
                    [],
                    'correlation-approved',
                    'causation-approved',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    'txn-approved',
                    expect.objectContaining({
                        transactionExternalId: 'txn-approved',
                        transactionStatus: TransactionStatus.APPROVED,
                    }),
                );
            });

            it('should include reason from reasons array', async () => {
                await publisher.publishResult(
                    'txn-reason',
                    TransactionStatus.APPROVED,
                    ['Reason 1', 'Reason 2', 'Reason 3'],
                    [],
                    'correlation-reason',
                    'causation-reason',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        reason: 'Reason 1; Reason 2; Reason 3',
                    }),
                );
            });

            it('should use default reason when reasons array is empty', async () => {
                await publisher.publishResult(
                    'txn-default',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation-default',
                    'causation-default',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        reason: 'Transaction validated successfully',
                    }),
                );
            });

            it('should include matched rules array', async () => {
                await publisher.publishResult(
                    'txn-rules',
                    TransactionStatus.APPROVED,
                    ['No rules matched'],
                    [],
                    'correlation-rules',
                    'causation-rules',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        matchedRules: [],
                    }),
                );
            });

            it('should include validatedAt timestamp', async () => {
                const beforeCall = new Date().toISOString();

                await publisher.publishResult(
                    'txn-timestamp',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation-timestamp',
                    'causation-timestamp',
                );

                const afterCall = new Date().toISOString();

                const callArgs = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;
                expect(callArgs.validatedAt).toBeDefined();
                expect(callArgs.validatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
                expect(callArgs.validatedAt >= beforeCall).toBe(true);
                expect(callArgs.validatedAt <= afterCall).toBe(true);
            });

            it('should include metadata with correlationId and causationId', async () => {
                await publisher.publishResult(
                    'txn-metadata',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation-metadata',
                    'causation-metadata',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        metadata: expect.objectContaining({
                            correlationId: 'correlation-metadata',
                            causationId: 'causation-metadata',
                        }),
                    }),
                );
            });

            it('should include metadata with service name and version', async () => {
                await publisher.publishResult(
                    'txn-service',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation-service',
                    'causation-service',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        metadata: expect.objectContaining({
                            service: 'AntiFraudService',
                            version: '1.0.0',
                        }),
                    }),
                );
            });

            it('should include metadata timestamp', async () => {
                await publisher.publishResult(
                    'txn-meta-timestamp',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation-meta',
                    'causation-meta',
                );

                const callArgs = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;
                expect(callArgs.metadata.timestamp).toBeDefined();
                expect(typeof callArgs.metadata.timestamp).toBe('string');
            });
        });

        describe('when status is rejected', () => {
            it('should publish to TRANSACTION_REJECTED topic', async () => {
                await publisher.publishResult(
                    'txn-rejected',
                    TransactionStatus.REJECTED,
                    ['Fraud detected'],
                    ['High Value Rule'],
                    'correlation-rejected',
                    'causation-rejected',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    KafkaTopics.TRANSACTION_REJECTED,
                    'txn-rejected',
                    expect.any(Object),
                );
            });

            it('should include rejection reason', async () => {
                await publisher.publishResult(
                    'txn-fraud',
                    TransactionStatus.REJECTED,
                    ['Amount exceeds threshold', 'Suspicious pattern detected'],
                    ['Rule 1', 'Rule 2'],
                    'correlation-fraud',
                    'causation-fraud',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        reason: 'Amount exceeds threshold; Suspicious pattern detected',
                        transactionStatus: TransactionStatus.REJECTED,
                    }),
                );
            });

            it('should include matched rule names', async () => {
                await publisher.publishResult(
                    'txn-matched',
                    TransactionStatus.REJECTED,
                    ['Blacklisted account'],
                    ['Account Blacklist Rule', 'Velocity Check'],
                    'correlation-matched',
                    'causation-matched',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        matchedRules: ['Account Blacklist Rule', 'Velocity Check'],
                    }),
                );
            });

            it('should include transaction external ID', async () => {
                await publisher.publishResult(
                    'txn-external-123',
                    TransactionStatus.REJECTED,
                    ['Fraud'],
                    ['Rule'],
                    'correlation-ext',
                    'causation-ext',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    'txn-external-123',
                    expect.objectContaining({
                        transactionExternalId: 'txn-external-123',
                    }),
                );
            });

            it('should include metadata with correct correlation chain', async () => {
                await publisher.publishResult(
                    'txn-chain',
                    TransactionStatus.REJECTED,
                    ['Rejected'],
                    [],
                    'original-correlation-id',
                    'original-request-id',
                );

                expect(mockKafkaProducer.sendMessage).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        metadata: expect.objectContaining({
                            correlationId: 'original-correlation-id',
                            causationId: 'original-request-id',
                        }),
                    }),
                );
            });
        });

        describe('topic routing', () => {
            it('should route to approved topic for APPROVED status', async () => {
                await publisher.publishResult(
                    'txn-route-approved',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation',
                    'causation',
                );

                const topic = mockKafkaProducer.sendMessage.mock.calls[0][0];
                expect(topic).toBe(KafkaTopics.TRANSACTION_APPROVED);
            });

            it('should route to rejected topic for REJECTED status', async () => {
                await publisher.publishResult(
                    'txn-route-rejected',
                    TransactionStatus.REJECTED,
                    [],
                    [],
                    'correlation',
                    'causation',
                );

                const topic = mockKafkaProducer.sendMessage.mock.calls[0][0];
                expect(topic).toBe(KafkaTopics.TRANSACTION_REJECTED);
            });

            it('should use transaction ID as message key', async () => {
                await publisher.publishResult(
                    'txn-key-123',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation',
                    'causation',
                );

                const messageKey = mockKafkaProducer.sendMessage.mock.calls[0][1];
                expect(messageKey).toBe('txn-key-123');
            });
        });

        describe('reason formatting', () => {
            it('should join multiple reasons with semicolon and space', async () => {
                await publisher.publishResult(
                    'txn-join',
                    TransactionStatus.REJECTED,
                    ['Reason A', 'Reason B', 'Reason C', 'Reason D'],
                    [],
                    'correlation',
                    'causation',
                );

                const event = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;
                expect(event.reason).toBe('Reason A; Reason B; Reason C; Reason D');
            });

            it('should handle single reason', async () => {
                await publisher.publishResult(
                    'txn-single',
                    TransactionStatus.APPROVED,
                    ['Single reason'],
                    [],
                    'correlation',
                    'causation',
                );

                const event = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;
                expect(event.reason).toBe('Single reason');
            });

            it('should use default message for empty reasons array', async () => {
                await publisher.publishResult(
                    'txn-empty',
                    TransactionStatus.APPROVED,
                    [],
                    [],
                    'correlation',
                    'causation',
                );

                const event = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;
                expect(event.reason).toBe('Transaction validated successfully');
            });
        });

        describe('error handling', () => {
            it('should propagate Kafka producer errors', async () => {
                mockKafkaProducer.sendMessage.mockRejectedValue(new Error('Kafka connection error'));

                await expect(
                    publisher.publishResult(
                        'txn-error',
                        TransactionStatus.APPROVED,
                        [],
                        [],
                        'correlation',
                        'causation',
                    ),
                ).rejects.toThrow('Kafka connection error');
            });

            it('should not catch producer errors', async () => {
                mockKafkaProducer.sendMessage.mockRejectedValue(new Error('Network timeout'));

                await expect(
                    publisher.publishResult(
                        'txn-timeout',
                        TransactionStatus.REJECTED,
                        ['Fraud'],
                        [],
                        'correlation',
                        'causation',
                    ),
                ).rejects.toThrow('Network timeout');
            });
        });

        describe('event structure completeness', () => {
            it('should include all required fields in approved event', async () => {
                await publisher.publishResult(
                    'txn-complete',
                    TransactionStatus.APPROVED,
                    ['Complete check'],
                    ['Rule A', 'Rule B'],
                    'correlation-complete',
                    'causation-complete',
                );

                const event = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;

                expect(event).toHaveProperty('transactionExternalId');
                expect(event).toHaveProperty('transactionStatus');
                expect(event).toHaveProperty('reason');
                expect(event).toHaveProperty('matchedRules');
                expect(event).toHaveProperty('validatedAt');
                expect(event).toHaveProperty('metadata');
                expect(event.metadata).toHaveProperty('correlationId');
                expect(event.metadata).toHaveProperty('causationId');
                expect(event.metadata).toHaveProperty('timestamp');
                expect(event.metadata).toHaveProperty('service');
                expect(event.metadata).toHaveProperty('version');
            });

            it('should include all required fields in rejected event', async () => {
                await publisher.publishResult(
                    'txn-complete-reject',
                    TransactionStatus.REJECTED,
                    ['Fraud detected'],
                    ['Blacklist'],
                    'correlation-reject-complete',
                    'causation-reject-complete',
                );

                const event = mockKafkaProducer.sendMessage.mock.calls[0][2] as any;

                expect(event.transactionExternalId).toBe('txn-complete-reject');
                expect(event.transactionStatus).toBe(TransactionStatus.REJECTED);
                expect(event.reason).toBe('Fraud detected');
                expect(event.matchedRules).toEqual(['Blacklist']);
                expect(event.validatedAt).toBeDefined();
                expect(event.metadata.correlationId).toBe('correlation-reject-complete');
                expect(event.metadata.causationId).toBe('causation-reject-complete');
                expect(event.metadata.service).toBe('AntiFraudService');
                expect(event.metadata.version).toBe('1.0.0');
            });
        });
    });
});
