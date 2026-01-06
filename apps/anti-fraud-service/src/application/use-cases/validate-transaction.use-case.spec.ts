import { FraudAction, type FraudRuleEvaluationResult } from '@app/common/types/fraud-rules.types';
import type { LoggerService } from '@app/observability';
import type { IEventPublisher } from '../../domain/ports/output/event-publisher.interface';
import type { RulesEngineService } from '../../domain/services/rules-engine.service';
import { ValidateTransactionUseCase } from './validate-transaction.use-case';

describe('ValidateTransactionUseCase', () => {
    let useCase: ValidateTransactionUseCase;
    let mockRulesEngine: jest.Mocked<RulesEngineService>;
    let mockLogger: jest.Mocked<LoggerService>;
    let mockEventPublisher: jest.Mocked<IEventPublisher>;

    beforeEach(() => {
        mockRulesEngine = {
            evaluateTransaction: jest.fn(),
            determineFinalAction: jest.fn(),
        } as any;

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;

        mockEventPublisher = {
            publishResult: jest.fn(),
        } as jest.Mocked<IEventPublisher>;

        useCase = new ValidateTransactionUseCase(mockRulesEngine, mockLogger, mockEventPublisher);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        const transactionData = {
            transactionId: 'txn-123',
            value: 500,
            accountExternalIdDebit: 'debit-account-123',
            accountExternalIdCredit: 'credit-account-456',
            transferTypeId: 1,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            metadata: {
                correlationId: 'correlation-123',
                causationId: 'causation-456',
                service: 'TransactionService',
            },
        };

        describe('when transaction is approved', () => {
            beforeEach(() => {
                const ruleResults: FraudRuleEvaluationResult[] = [];
                mockRulesEngine.evaluateTransaction.mockResolvedValue(ruleResults);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.APPROVE,
                    matchedRules: [],
                    reasons: ['No fraud rules matched'],
                });
            });

            it('should evaluate transaction with rules engine', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockRulesEngine.evaluateTransaction).toHaveBeenCalledWith({
                    transactionExternalId: transactionData.transactionId,
                    accountExternalIdDebit: transactionData.accountExternalIdDebit,
                    accountExternalIdCredit: transactionData.accountExternalIdCredit,
                    transferTypeId: transactionData.transferTypeId,
                    value: transactionData.value,
                    createdAt: transactionData.createdAt,
                });
            });

            it('should publish approved status', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockEventPublisher.publishResult).toHaveBeenCalledWith(
                    transactionData.transactionId,
                    'approved',
                    ['No fraud rules matched'],
                    [],
                    transactionData.metadata.correlationId,
                    transactionData.metadata.causationId,
                );
            });

            it('should log approved transaction with log level', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockLogger.log).toHaveBeenCalledWith(
                    'Transaction approve',
                    expect.objectContaining({
                        correlationId: transactionData.metadata.correlationId,
                        requestId: transactionData.metadata.causationId,
                    }),
                    expect.objectContaining({
                        transactionId: transactionData.transactionId,
                        action: FraudAction.APPROVE,
                        value: transactionData.value,
                    }),
                );
            });
        });

        describe('when transaction is rejected', () => {
            const matchedRules: FraudRuleEvaluationResult[] = [
                {
                    ruleId: 'rule-1',
                    ruleName: 'High Value Reject',
                    matched: true,
                    action: FraudAction.REJECT,
                    reason: 'Amount exceeds threshold',
                },
            ];

            beforeEach(() => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue(matchedRules);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.REJECT,
                    matchedRules,
                    reasons: ['High Value Reject: Amount exceeds threshold'],
                });
            });

            it('should publish rejected status', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockEventPublisher.publishResult).toHaveBeenCalledWith(
                    transactionData.transactionId,
                    'rejected',
                    ['High Value Reject: Amount exceeds threshold'],
                    ['High Value Reject'],
                    transactionData.metadata.correlationId,
                    transactionData.metadata.causationId,
                );
            });

            it('should log rejected transaction with warn level', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockLogger.warn).toHaveBeenCalledWith(
                    'Transaction reject',
                    expect.objectContaining({
                        correlationId: transactionData.metadata.correlationId,
                    }),
                    expect.objectContaining({
                        transactionId: transactionData.transactionId,
                        action: FraudAction.REJECT,
                        matchedRules: ['High Value Reject'],
                    }),
                );
            });
        });

        describe('when transaction is flagged', () => {
            const matchedRules: FraudRuleEvaluationResult[] = [
                {
                    ruleId: 'rule-2',
                    ruleName: 'Suspicious Pattern',
                    matched: true,
                    action: FraudAction.FLAG,
                    reason: 'Pattern detected',
                },
            ];

            beforeEach(() => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue(matchedRules);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.FLAG,
                    matchedRules,
                    reasons: ['Suspicious Pattern: Pattern detected'],
                });
            });

            it('should publish rejected status for FLAG action', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockEventPublisher.publishResult).toHaveBeenCalledWith(
                    transactionData.transactionId,
                    'rejected',
                    ['Suspicious Pattern: Pattern detected'],
                    ['Suspicious Pattern'],
                    transactionData.metadata.correlationId,
                    transactionData.metadata.causationId,
                );
            });

            it('should log flagged transaction with log level', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockLogger.log).toHaveBeenCalledWith(
                    'Transaction flag',
                    expect.any(Object),
                    expect.objectContaining({
                        action: FraudAction.FLAG,
                        matchedRules: ['Suspicious Pattern'],
                    }),
                );
            });
        });

        describe('when transaction requires review', () => {
            const matchedRules: FraudRuleEvaluationResult[] = [
                {
                    ruleId: 'rule-3',
                    ruleName: 'Manual Review Required',
                    matched: true,
                    action: FraudAction.REVIEW,
                    reason: 'Complex transaction',
                },
            ];

            beforeEach(() => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue(matchedRules);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.REVIEW,
                    matchedRules,
                    reasons: ['Manual Review Required: Complex transaction'],
                });
            });

            it('should publish rejected status for REVIEW action', async () => {
                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockEventPublisher.publishResult).toHaveBeenCalledWith(
                    transactionData.transactionId,
                    'rejected',
                    ['Manual Review Required: Complex transaction'],
                    ['Manual Review Required'],
                    transactionData.metadata.correlationId,
                    transactionData.metadata.causationId,
                );
            });
        });

        describe('logging', () => {
            it('should log validation start', async () => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue([]);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.APPROVE,
                    matchedRules: [],
                    reasons: [],
                });

                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockLogger.log).toHaveBeenCalledWith(
                    'Validating transaction',
                    expect.objectContaining({
                        correlationId: transactionData.metadata.correlationId,
                        requestId: transactionData.metadata.causationId,
                        service: transactionData.metadata.service,
                    }),
                    {
                        transactionId: transactionData.transactionId,
                        value: transactionData.value,
                        transferTypeId: transactionData.transferTypeId,
                    },
                );
            });
        });

        describe('context building', () => {
            it('should build correct fraud evaluation context', async () => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue([]);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.APPROVE,
                    matchedRules: [],
                    reasons: [],
                });

                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockRulesEngine.evaluateTransaction).toHaveBeenCalledWith({
                    transactionExternalId: transactionData.transactionId,
                    accountExternalIdDebit: transactionData.accountExternalIdDebit,
                    accountExternalIdCredit: transactionData.accountExternalIdCredit,
                    transferTypeId: transactionData.transferTypeId,
                    value: transactionData.value,
                    createdAt: transactionData.createdAt,
                });
            });
        });

        describe('error propagation', () => {
            it('should propagate rules engine evaluation errors', async () => {
                const error = new Error('Rules engine error');
                mockRulesEngine.evaluateTransaction.mockRejectedValue(error);

                await expect(
                    useCase.execute(
                        transactionData.transactionId,
                        transactionData.value,
                        transactionData.accountExternalIdDebit,
                        transactionData.accountExternalIdCredit,
                        transactionData.transferTypeId,
                        transactionData.createdAt,
                        transactionData.metadata,
                    ),
                ).rejects.toThrow('Rules engine error');
            });

            it('should propagate event publisher errors', async () => {
                mockRulesEngine.evaluateTransaction.mockResolvedValue([]);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.APPROVE,
                    matchedRules: [],
                    reasons: [],
                });
                mockEventPublisher.publishResult.mockRejectedValue(new Error('Kafka error'));

                await expect(
                    useCase.execute(
                        transactionData.transactionId,
                        transactionData.value,
                        transactionData.accountExternalIdDebit,
                        transactionData.accountExternalIdCredit,
                        transactionData.transferTypeId,
                        transactionData.createdAt,
                        transactionData.metadata,
                    ),
                ).rejects.toThrow('Kafka error');
            });
        });

        describe('multiple matched rules', () => {
            it('should handle multiple matched rules correctly', async () => {
                const matchedRules: FraudRuleEvaluationResult[] = [
                    {
                        ruleId: 'rule-1',
                        ruleName: 'Rule 1',
                        matched: true,
                        action: FraudAction.FLAG,
                        reason: 'Reason 1',
                    },
                    {
                        ruleId: 'rule-2',
                        ruleName: 'Rule 2',
                        matched: true,
                        action: FraudAction.REJECT,
                        reason: 'Reason 2',
                    },
                ];

                mockRulesEngine.evaluateTransaction.mockResolvedValue(matchedRules);
                mockRulesEngine.determineFinalAction.mockReturnValue({
                    action: FraudAction.REJECT,
                    matchedRules,
                    reasons: ['Rule 1: Reason 1', 'Rule 2: Reason 2'],
                });

                await useCase.execute(
                    transactionData.transactionId,
                    transactionData.value,
                    transactionData.accountExternalIdDebit,
                    transactionData.accountExternalIdCredit,
                    transactionData.transferTypeId,
                    transactionData.createdAt,
                    transactionData.metadata,
                );

                expect(mockEventPublisher.publishResult).toHaveBeenCalledWith(
                    transactionData.transactionId,
                    'rejected',
                    ['Rule 1: Reason 1', 'Rule 2: Reason 2'],
                    ['Rule 1', 'Rule 2'],
                    transactionData.metadata.correlationId,
                    transactionData.metadata.causationId,
                );
            });
        });
    });
});
