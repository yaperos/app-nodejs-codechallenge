import { FraudAction, type FraudRuleEvaluationResult, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { FraudRule } from '../entities/fraud-rule.entity';
import { RulesEngineService } from './rules-engine.service';

describe('RulesEngineService', () => {
    let service: RulesEngineService;
    let mockRepository: any;
    let mockRules: FraudRule[];

    beforeEach(() => {
        mockRules = [
            new FraudRule(
                '1',
                'High Value Rule',
                'Flag transactions over $1000',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'gt', value: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            ),
            new FraudRule(
                '2',
                'Reject Rule',
                'Reject transactions over $5000',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'gt', value: 5000 },
                FraudAction.REJECT,
                2,
                true,
                new Date(),
                new Date(),
            ),
        ];

        mockRepository = {
            findActiveRules: jest.fn().mockResolvedValue(mockRules),
            logExecution: jest.fn().mockResolvedValue(undefined),
        };

        service = new RulesEngineService(mockRepository);
    });

    describe('evaluateTransaction', () => {
        it('should return evaluation results for all active rules', async () => {
            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 100,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results).toHaveLength(2);
            expect(results[0]).toHaveProperty('ruleId');
            expect(results[0]).toHaveProperty('ruleName');
            expect(results[0]).toHaveProperty('matched');
            expect(results[0]).toHaveProperty('action');
        });

        it('should match rules when conditions are met', async () => {
            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 1500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            const matchedResult = results.find((r) => r.ruleId === '1');
            expect(matchedResult?.matched).toBe(true);
            expect(matchedResult?.reason).toContain('1500 gt 1000');
        });
    });

    describe('determineFinalAction', () => {
        it('should return APPROVE when no rules match', () => {
            const ruleResults: FraudRuleEvaluationResult[] = [];

            const result = service.determineFinalAction(ruleResults);

            expect(result.action).toBe(FraudAction.APPROVE);
            expect(result.matchedRules).toHaveLength(0);
            expect(result.reasons).toEqual(['No fraud rules matched']);
        });

        it('should return REJECT when highest priority rule rejects', () => {
            const ruleResults: FraudRuleEvaluationResult[] = [
                {
                    ruleId: '1',
                    ruleName: 'High Value Rule',
                    action: FraudAction.FLAG,
                    matched: true,
                    reason: 'Amount exceeds threshold',
                },
                {
                    ruleId: '2',
                    ruleName: 'Reject Rule',
                    action: FraudAction.REJECT,
                    matched: true,
                    reason: 'Amount too high',
                },
            ];

            const result = service.determineFinalAction(ruleResults);

            expect(result.action).toBe(FraudAction.REJECT);
            expect(result.matchedRules).toHaveLength(2);
            expect(result.reasons).toContain('Reject Rule: Amount too high');
        });

        it('should return FLAG when highest priority rule flags', () => {
            const ruleResults: FraudRuleEvaluationResult[] = [
                {
                    ruleId: '1',
                    ruleName: 'High Value Rule',
                    action: FraudAction.FLAG,
                    matched: true,
                    reason: 'Amount exceeds threshold',
                },
            ];

            const result = service.determineFinalAction(ruleResults);

            expect(result.action).toBe(FraudAction.FLAG);
            expect(result.matchedRules).toHaveLength(1);
            expect(result.reasons).toContain('High Value Rule: Amount exceeds threshold');
        });

        it('should return REVIEW when REVIEW has higher priority than FLAG', () => {
            const ruleResults: FraudRuleEvaluationResult[] = [
                {
                    ruleId: '1',
                    ruleName: 'Flag Rule',
                    action: FraudAction.FLAG,
                    matched: true,
                    reason: 'Flagged for review',
                },
                {
                    ruleId: '2',
                    ruleName: 'Review Rule',
                    action: FraudAction.REVIEW,
                    matched: true,
                    reason: 'Requires manual review',
                },
            ];

            const result = service.determineFinalAction(ruleResults);

            expect(result.action).toBe(FraudAction.REVIEW);
            expect(result.matchedRules).toHaveLength(2);
        });

        it('should filter out non-matched rules', () => {
            const ruleResults: FraudRuleEvaluationResult[] = [
                {
                    ruleId: '1',
                    ruleName: 'Matched Rule',
                    action: FraudAction.FLAG,
                    matched: true,
                    reason: 'Matched',
                },
                {
                    ruleId: '2',
                    ruleName: 'Non-matched Rule',
                    action: FraudAction.REJECT,
                    matched: false,
                },
            ];

            const result = service.determineFinalAction(ruleResults);

            expect(result.action).toBe(FraudAction.FLAG);
            expect(result.matchedRules).toHaveLength(1);
            expect(result.matchedRules[0].ruleId).toBe('1');
        });
    });

    describe('AMOUNT_THRESHOLD operators', () => {
        it('should evaluate gte operator correctly', async () => {
            const gteRule = new FraudRule(
                'gte-1',
                'GTE Rule',
                'Greater than or equal',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'gte', value: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([gteRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 1000,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });

        it('should evaluate lt operator correctly', async () => {
            const ltRule = new FraudRule(
                'lt-1',
                'LT Rule',
                'Less than',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'lt', value: 100 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([ltRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 50,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });

        it('should evaluate lte operator correctly', async () => {
            const lteRule = new FraudRule(
                'lte-1',
                'LTE Rule',
                'Less than or equal',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'lte', value: 100 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([lteRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 100,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });

        it('should evaluate eq operator correctly', async () => {
            const eqRule = new FraudRule(
                'eq-1',
                'EQ Rule',
                'Equals',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: 'eq', value: 999.99 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([eqRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 999.99,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });
    });

    describe('ACCOUNT_BLACKLIST rule type', () => {
        it('should match when debit account is blacklisted', async () => {
            const blacklistRule = new FraudRule(
                'blacklist-1',
                'Account Blacklist',
                'Reject blacklisted accounts',
                FraudRuleType.ACCOUNT_BLACKLIST,
                { accounts: ['blacklisted-account-123'] },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([blacklistRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'blacklisted-account-123',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
            expect(results[0].reason).toBe('Account is in blacklist');
        });

        it('should match when credit account is blacklisted', async () => {
            const blacklistRule = new FraudRule(
                'blacklist-1',
                'Account Blacklist',
                'Reject blacklisted accounts',
                FraudRuleType.ACCOUNT_BLACKLIST,
                { accounts: ['blacklisted-credit-456'] },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([blacklistRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'blacklisted-credit-456',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });

        it('should not match when accounts are not blacklisted', async () => {
            const blacklistRule = new FraudRule(
                'blacklist-1',
                'Account Blacklist',
                'Reject blacklisted accounts',
                FraudRuleType.ACCOUNT_BLACKLIST,
                { accounts: ['blacklisted-account-999'] },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([blacklistRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
        });
    });

    describe('TRANSFER_TYPE_LIMIT rule type', () => {
        it('should match when transfer type matches and exceeds limit', async () => {
            const typeLimitRule = new FraudRule(
                'type-limit-1',
                'Transfer Type Limit',
                'Limit transfers',
                FraudRuleType.TRANSFER_TYPE_LIMIT,
                { transferTypeId: 1, maxAmount: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([typeLimitRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 1500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
            expect(results[0].reason).toBe('Transfer type 1 exceeds limit of 1000');
        });

        it('should not match when transfer type is different', async () => {
            const typeLimitRule = new FraudRule(
                'type-limit-1',
                'Transfer Type Limit',
                'Limit transfers',
                FraudRuleType.TRANSFER_TYPE_LIMIT,
                { transferTypeId: 2, maxAmount: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([typeLimitRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 1500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
        });

        it('should not match when amount is within limit', async () => {
            const typeLimitRule = new FraudRule(
                'type-limit-1',
                'Transfer Type Limit',
                'Limit transfers',
                FraudRuleType.TRANSFER_TYPE_LIMIT,
                { transferTypeId: 1, maxAmount: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([typeLimitRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
        });
    });

    describe('TIME_BASED rule type', () => {
        it('should match when transaction is outside allowed hours', async () => {
            const timeRule = new FraudRule(
                'time-1',
                'Business Hours Only',
                'Only allow transactions during business hours',
                FraudRuleType.TIME_BASED,
                {
                    allowedHours: { start: 9, end: 17 },
                    allowedDays: [1, 2, 3, 4, 5],
                },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([timeRule]);

            const testDate = new Date('2024-01-08T00:00:00');
            testDate.setHours(22, 0, 0, 0);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: testDate,
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
            expect(results[0].reason).toBe('Transaction outside allowed time window');
        });

        it('should match when transaction is on disallowed day', async () => {
            const timeRule = new FraudRule(
                'time-1',
                'Weekdays Only',
                'Only allow transactions on weekdays',
                FraudRuleType.TIME_BASED,
                {
                    allowedHours: { start: 0, end: 23 },
                    allowedDays: [1, 2, 3, 4, 5],
                },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([timeRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date('2024-01-07T12:00:00Z'),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(true);
        });

        it('should not match when transaction is within allowed time window', async () => {
            const timeRule = new FraudRule(
                'time-1',
                'Business Hours',
                'Allow during business hours',
                FraudRuleType.TIME_BASED,
                {
                    allowedHours: { start: 9, end: 17 },
                    allowedDays: [1, 2, 3, 4, 5],
                },
                FraudAction.REJECT,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([timeRule]);

            const testDate = new Date('2024-01-08T00:00:00');
            testDate.setHours(12, 0, 0, 0);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: testDate,
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
        });
    });

    describe('DAILY_LIMIT rule type', () => {
        it('should return not matched with pending implementation message', async () => {
            const dailyLimitRule = new FraudRule(
                'daily-1',
                'Daily Limit',
                'Limit daily transactions',
                FraudRuleType.DAILY_LIMIT,
                { maxCount: 10, maxAmount: 5000 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([dailyLimitRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
            expect(results[0].reason).toBe('Daily limit check - implementation pending');
        });
    });

    describe('VELOCITY_CHECK rule type', () => {
        it('should return not matched with pending implementation message', async () => {
            const velocityRule = new FraudRule(
                'velocity-1',
                'Velocity Check',
                'Check transaction velocity',
                FraudRuleType.VELOCITY_CHECK,
                { maxTransactions: 5, windowMinutes: 60 },
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([velocityRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
            expect(results[0].reason).toBe('Velocity check - implementation pending');
        });
    });

    describe('error handling', () => {
        it('should handle unknown rule types gracefully', async () => {
            const unknownRule = new FraudRule(
                'unknown-1',
                'Unknown Rule',
                'Test unknown type',
                'UNKNOWN_TYPE' as any,
                {},
                FraudAction.FLAG,
                1,
                true,
                new Date(),
                new Date(),
            );

            mockRepository.findActiveRules.mockResolvedValue([unknownRule]);

            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 500,
                createdAt: new Date(),
            };

            const results = await service.evaluateTransaction(context);

            expect(results[0].matched).toBe(false);
            expect(results[0].reason).toBe('Unknown rule type: UNKNOWN_TYPE');
        });

        it('should log rule executions', async () => {
            const context = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'acc-debit',
                accountExternalIdCredit: 'acc-credit',
                transferTypeId: 1,
                value: 1500,
                createdAt: new Date(),
            };

            await service.evaluateTransaction(context);

            expect(mockRepository.logExecution).toHaveBeenCalledTimes(2);
            expect(mockRepository.logExecution).toHaveBeenCalledWith(
                expect.objectContaining({
                    ruleId: expect.any(String),
                    transactionExternalId: 'txn-123',
                    matched: expect.any(Boolean),
                    action: expect.any(String),
                }),
            );
        });
    });
});
