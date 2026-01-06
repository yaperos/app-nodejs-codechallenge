import { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { FraudRule } from './fraud-rule.entity';

describe('FraudRule', () => {
    describe('constructor', () => {
        it('should create a fraud rule with all required properties', () => {
            const rule = new FraudRule(
                '1',
                'High Value Transaction',
                'Flag transactions over $1000',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: '>', value: 1000 },
                FraudAction.FLAG,
                1,
                true,
                new Date('2024-01-01'),
                new Date('2024-01-01'),
            );

            expect(rule.id).toBe('1');
            expect(rule.name).toBe('High Value Transaction');
            expect(rule.description).toBe('Flag transactions over $1000');
            expect(rule.ruleType).toBe(FraudRuleType.AMOUNT_THRESHOLD);
            expect(rule.condition).toEqual({ operator: '>', value: 1000 });
            expect(rule.action).toBe(FraudAction.FLAG);
            expect(rule.priority).toBe(1);
            expect(rule.isActive).toBe(true);
            expect(rule.createdAt).toEqual(new Date('2024-01-01'));
            expect(rule.updatedAt).toEqual(new Date('2024-01-01'));
        });
    });

    describe('business methods', () => {
        let rule: FraudRule;

        beforeEach(() => {
            rule = new FraudRule(
                '1',
                'Test Rule',
                'Test description',
                FraudRuleType.AMOUNT_THRESHOLD,
                { operator: '>', value: 500 },
                FraudAction.REVIEW,
                1,
                true,
                new Date(),
                new Date(),
            );
        });

        it('should be active', () => {
            expect(rule.isActive).toBe(true);
        });

        it('should have correct priority', () => {
            expect(rule.priority).toBe(1);
        });

        it('should have correct action', () => {
            expect(rule.action).toBe(FraudAction.REVIEW);
        });
    });
});
