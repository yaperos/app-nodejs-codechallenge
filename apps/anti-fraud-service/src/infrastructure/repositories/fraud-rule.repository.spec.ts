import type { DrizzleClient } from '@app/common';
import { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { FraudRule } from '../../domain/entities/fraud-rule.entity';
import type { FraudRuleExecution } from '../../domain/types/fraud-rule-execution.type';
import { FraudRuleRepository } from './fraud-rule.repository';

describe('FraudRuleRepository', () => {
    let repository: FraudRuleRepository;
    let mockDb: jest.Mocked<DrizzleClient>;

    beforeEach(() => {
        const mockOrderBy = jest.fn().mockResolvedValue([]);
        const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
        const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
        const mockValues = jest.fn().mockResolvedValue(undefined);

        mockDb = {
            select: jest.fn().mockReturnValue({ from: mockFrom }),
            insert: jest.fn().mockReturnValue({ values: mockValues }),
        } as any;

        repository = new FraudRuleRepository(mockDb);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findActiveRules', () => {
        it('should return all active rules ordered by priority', async () => {
            const dbRules = [
                {
                    id: 'rule-1',
                    name: 'High Priority Rule',
                    description: 'First rule',
                    ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                    condition: { operator: 'gt', value: 1000 },
                    action: FraudAction.REJECT,
                    priority: 1,
                    isActive: true,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                },
                {
                    id: 'rule-2',
                    name: 'Low Priority Rule',
                    description: 'Second rule',
                    ruleType: FraudRuleType.ACCOUNT_BLACKLIST,
                    condition: { accounts: ['acc-123'] },
                    action: FraudAction.FLAG,
                    priority: 2,
                    isActive: true,
                    createdAt: new Date('2024-01-02'),
                    updatedAt: new Date('2024-01-02'),
                },
            ];

            const mockOrderBy = jest.fn().mockResolvedValue(dbRules);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findActiveRules();

            expect(mockDb.select).toHaveBeenCalled();
            expect(mockFrom).toHaveBeenCalled();
            expect(mockWhere).toHaveBeenCalled();
            expect(mockOrderBy).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(FraudRule);
            expect(result[0].id).toBe('rule-1');
            expect(result[0].priority).toBe(1);
            expect(result[1].id).toBe('rule-2');
            expect(result[1].priority).toBe(2);
        });

        it('should return empty array when no active rules exist', async () => {
            const mockOrderBy = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findActiveRules();

            expect(result).toEqual([]);
        });

        it('should filter by isActive = true', async () => {
            const mockOrderBy = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            await repository.findActiveRules();

            expect(mockWhere).toHaveBeenCalled();
        });

        it('should map all rule types correctly', async () => {
            const ruleTypes = [
                FraudRuleType.AMOUNT_THRESHOLD,
                FraudRuleType.ACCOUNT_BLACKLIST,
                FraudRuleType.TRANSFER_TYPE_LIMIT,
                FraudRuleType.TIME_BASED,
                FraudRuleType.DAILY_LIMIT,
                FraudRuleType.VELOCITY_CHECK,
            ];

            const dbRules = ruleTypes.map((ruleType, index) => ({
                id: `rule-${index}`,
                name: `Rule ${index}`,
                description: `Description ${index}`,
                ruleType,
                condition: {},
                action: FraudAction.FLAG,
                priority: index + 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            const mockOrderBy = jest.fn().mockResolvedValue(dbRules);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findActiveRules();

            expect(result).toHaveLength(6);
            result.forEach((rule, index) => {
                expect(rule.ruleType).toBe(ruleTypes[index]);
            });
        });

        it('should map all fraud actions correctly', async () => {
            const actions = [FraudAction.APPROVE, FraudAction.FLAG, FraudAction.REVIEW, FraudAction.REJECT];

            const dbRules = actions.map((action, index) => ({
                id: `rule-${index}`,
                name: `Rule ${index}`,
                description: `Description ${index}`,
                ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                condition: { operator: 'gt', value: 100 },
                action,
                priority: index + 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            const mockOrderBy = jest.fn().mockResolvedValue(dbRules);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findActiveRules();

            expect(result).toHaveLength(4);
            result.forEach((rule, index) => {
                expect(rule.action).toBe(actions[index]);
            });
        });

        it('should preserve complex JSONB conditions', async () => {
            const complexCondition = {
                operator: 'gte',
                value: 5000,
                metadata: { risk: 'high', region: 'LATAM' },
            };

            const dbRules = [
                {
                    id: 'rule-complex',
                    name: 'Complex Rule',
                    description: 'With complex condition',
                    ruleType: FraudRuleType.AMOUNT_THRESHOLD,
                    condition: complexCondition,
                    action: FraudAction.REVIEW,
                    priority: 1,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            const mockOrderBy = jest.fn().mockResolvedValue(dbRules);
            const mockWhere = jest.fn().mockReturnValue({ orderBy: mockOrderBy });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findActiveRules();

            expect(result[0].condition).toEqual(complexCondition);
        });
    });

    describe('logExecution', () => {
        it('should log a matched fraud rule execution', async () => {
            const execution: FraudRuleExecution = {
                ruleId: 'rule-123',
                transactionExternalId: 'txn-456',
                matched: true,
                action: FraudAction.REJECT,
                details: { amount: 5000, threshold: 1000 },
            };

            const mockValues = jest.fn().mockResolvedValue(undefined);
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            await repository.logExecution(execution);

            expect(mockDb.insert).toHaveBeenCalled();
            expect(mockValues).toHaveBeenCalledWith({
                ruleId: 'rule-123',
                transactionExternalId: 'txn-456',
                matched: true,
                action: FraudAction.REJECT,
                details: { amount: 5000, threshold: 1000 },
            });
        });

        it('should log a non-matched fraud rule execution', async () => {
            const execution: FraudRuleExecution = {
                ruleId: 'rule-789',
                transactionExternalId: 'txn-999',
                matched: false,
                action: FraudAction.APPROVE,
                details: {},
            };

            const mockValues = jest.fn().mockResolvedValue(undefined);
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            await repository.logExecution(execution);

            expect(mockValues).toHaveBeenCalledWith({
                ruleId: 'rule-789',
                transactionExternalId: 'txn-999',
                matched: false,
                action: FraudAction.APPROVE,
                details: {},
            });
        });

        it('should handle executions with complex details', async () => {
            const execution: FraudRuleExecution = {
                ruleId: 'rule-complex',
                transactionExternalId: 'txn-complex',
                matched: true,
                action: FraudAction.FLAG,
                details: {
                    value: 2500,
                    threshold: 1000,
                    debitAccount: 'acc-debit',
                    creditAccount: 'acc-credit',
                    transferTypeId: 1,
                    metadata: {
                        risk: 'medium',
                        confidence: 0.85,
                    },
                },
            };

            const mockValues = jest.fn().mockResolvedValue(undefined);
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            await repository.logExecution(execution);

            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({
                    details: execution.details,
                }),
            );
        });

        it('should log executions for all action types', async () => {
            const actions = [FraudAction.APPROVE, FraudAction.FLAG, FraudAction.REVIEW, FraudAction.REJECT];

            for (const action of actions) {
                const execution: FraudRuleExecution = {
                    ruleId: `rule-${action}`,
                    transactionExternalId: 'txn-test',
                    matched: true,
                    action,
                    details: {},
                };

                const mockValues = jest.fn().mockResolvedValue(undefined);
                mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

                await repository.logExecution(execution);

                expect(mockValues).toHaveBeenCalledWith(
                    expect.objectContaining({
                        action,
                    }),
                );
            }
        });

        it('should handle empty details object', async () => {
            const execution: FraudRuleExecution = {
                ruleId: 'rule-empty',
                transactionExternalId: 'txn-empty',
                matched: false,
                action: FraudAction.APPROVE,
                details: {},
            };

            const mockValues = jest.fn().mockResolvedValue(undefined);
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            await repository.logExecution(execution);

            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({
                    details: {},
                }),
            );
        });
    });
});
