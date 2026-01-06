import { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { FraudRule } from '../../domain/entities/fraud-rule.entity';
import type { FraudRule as FraudRuleSchema } from '../database/fraud-rules.schema';
import { FraudRuleMapper } from './fraud-rule.mapper';

describe('FraudRuleMapper', () => {
    describe('toDomain', () => {
        it('should map schema to domain entity with all fields', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-123',
                name: 'High Value Rule',
                description: 'Flag high value transactions',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 1000 },
                action: FraudAction.FLAG,
                priority: 1,
                isActive: true,
                createdAt: new Date('2024-01-01T00:00:00Z'),
                updatedAt: new Date('2024-01-02T00:00:00Z'),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result).toBeInstanceOf(FraudRule);
            expect(result.id).toBe('rule-123');
            expect(result.name).toBe('High Value Rule');
            expect(result.description).toBe('Flag high value transactions');
            expect(result.ruleType).toBe(FraudRuleType.AMOUNT_THRESHOLD);
            expect(result.condition).toEqual({ operator: 'gt', value: 1000 });
            expect(result.action).toBe(FraudAction.FLAG);
            expect(result.priority).toBe(1);
            expect(result.isActive).toBe(true);
            expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
            expect(result.updatedAt).toEqual(new Date('2024-01-02T00:00:00Z'));
        });

        it('should map ACCOUNT_BLACKLIST rule type', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-blacklist',
                name: 'Blacklist Rule',
                description: 'Block blacklisted accounts',
                ruleType: FraudRuleType.ACCOUNT_BLACKLIST,
                condition: { accounts: ['acc-123', 'acc-456'] },
                action: FraudAction.REJECT,
                priority: 2,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.ruleType).toBe(FraudRuleType.ACCOUNT_BLACKLIST);
            expect(result.condition).toEqual({ accounts: ['acc-123', 'acc-456'] });
        });

        it('should map TRANSFER_TYPE_LIMIT rule type', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-transfer-limit',
                name: 'Transfer Limit',
                description: 'Limit transfer amounts',
                ruleType: FraudRuleType.TRANSFER_TYPE_LIMIT,
                condition: { transferTypeId: 1, maxAmount: 5000 },
                action: FraudAction.FLAG,
                priority: 3,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.ruleType).toBe(FraudRuleType.TRANSFER_TYPE_LIMIT);
            expect(result.condition).toEqual({ transferTypeId: 1, maxAmount: 5000 });
        });

        it('should map TIME_BASED rule type', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-time',
                name: 'Business Hours',
                description: 'Only allow during business hours',
                ruleType: FraudRuleType.TIME_BASED,
                condition: {
                    allowedHours: { start: 9, end: 17 },
                    allowedDays: [1, 2, 3, 4, 5],
                },
                action: FraudAction.REJECT,
                priority: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.ruleType).toBe(FraudRuleType.TIME_BASED);
            expect(result.condition).toEqual({
                allowedHours: { start: 9, end: 17 },
                allowedDays: [1, 2, 3, 4, 5],
            });
        });

        it('should map DAILY_LIMIT rule type', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-daily',
                name: 'Daily Limit',
                description: 'Limit daily transactions',
                ruleType: FraudRuleType.DAILY_LIMIT,
                condition: { maxCount: 10, maxAmount: 10000 },
                action: FraudAction.REVIEW,
                priority: 4,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.ruleType).toBe(FraudRuleType.DAILY_LIMIT);
            expect(result.condition).toEqual({ maxCount: 10, maxAmount: 10000 });
        });

        it('should map VELOCITY_CHECK rule type', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-velocity',
                name: 'Velocity Check',
                description: 'Check transaction velocity',
                ruleType: FraudRuleType.VELOCITY_CHECK,
                condition: { maxTransactions: 5, windowMinutes: 60 },
                action: FraudAction.FLAG,
                priority: 5,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.ruleType).toBe(FraudRuleType.VELOCITY_CHECK);
            expect(result.condition).toEqual({ maxTransactions: 5, windowMinutes: 60 });
        });

        it('should map REJECT action', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-reject',
                name: 'Reject Rule',
                description: 'Reject transaction',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 10000 },
                action: FraudAction.REJECT,
                priority: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.action).toBe(FraudAction.REJECT);
        });

        it('should map REVIEW action', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-review',
                name: 'Review Rule',
                description: 'Requires review',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 5000 },
                action: FraudAction.REVIEW,
                priority: 2,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.action).toBe(FraudAction.REVIEW);
        });

        it('should map APPROVE action', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-approve',
                name: 'Approve Rule',
                description: 'Auto approve',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'lt', value: 100 },
                action: FraudAction.APPROVE,
                priority: 10,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.action).toBe(FraudAction.APPROVE);
        });

        it('should map inactive rules', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-inactive',
                name: 'Inactive Rule',
                description: 'This rule is inactive',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 1000 },
                action: FraudAction.FLAG,
                priority: 1,
                isActive: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.isActive).toBe(false);
        });

        it('should preserve priority values', () => {
            const schema: FraudRuleSchema = {
                id: 'rule-priority',
                name: 'Priority Rule',
                description: 'Test priority',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 1000 },
                action: FraudAction.FLAG,
                priority: 99,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.priority).toBe(99);
        });

        it('should handle complex JSONB conditions', () => {
            const complexCondition = {
                operator: 'gte',
                value: 1000,
                currency: 'USD',
                metadata: {
                    threshold: 'high',
                    category: 'suspicious',
                },
            };

            const schema: FraudRuleSchema = {
                id: 'rule-complex',
                name: 'Complex Rule',
                description: 'Complex condition',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: complexCondition,
                action: FraudAction.FLAG,
                priority: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.condition).toEqual(complexCondition);
        });

        it('should preserve timestamps', () => {
            const createdAt = new Date('2024-01-01T10:00:00Z');
            const updatedAt = new Date('2024-01-15T15:30:00Z');

            const schema: FraudRuleSchema = {
                id: 'rule-timestamps',
                name: 'Timestamp Rule',
                description: 'Test timestamps',
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 1000 },
                action: FraudAction.FLAG,
                priority: 1,
                isActive: true,
                createdAt,
                updatedAt,
            };

            const result = FraudRuleMapper.toDomain(schema);

            expect(result.createdAt).toEqual(createdAt);
            expect(result.updatedAt).toEqual(updatedAt);
        });
    });
});
