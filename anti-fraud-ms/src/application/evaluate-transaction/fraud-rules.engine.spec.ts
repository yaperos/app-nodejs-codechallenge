import type { TransactionToEvaluate } from '../../domain/models/fraud-evaluation';
import type { FraudRule } from '../../domain/rules/fraud-rule.interface';
import { MaxAmountRule } from '../../domain/rules/max-amount.rule';
import { FraudRulesEngine } from './fraud-rules.engine';

const tx = (value: number): TransactionToEvaluate => ({
    transactionId: '44444444-4444-4444-8444-444444444444',
    accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
    accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
    transferTypeId: 1,
    value,
});

const rejecting = (reason: string): FraudRule => ({
    name: reason,
    evaluate: () => ({ rule: reason, reason }),
});

describe('FraudRulesEngine', () => {
    it('approves when no rule is violated', () => {
        const engine = new FraudRulesEngine([new MaxAmountRule(1000)]);
        expect(engine.evaluate(tx(120))).toEqual({ status: 'approved', reasons: [] });
    });

    it('rejects when a rule is violated', () => {
        const engine = new FraudRulesEngine([new MaxAmountRule(1000)]);
        const verdict = engine.evaluate(tx(1500));
        expect(verdict.status).toBe('rejected');
        expect(verdict.reasons).toHaveLength(1);
    });

    it('runs every rule and collects all the reasons', () => {
        const engine = new FraudRulesEngine([rejecting('first'), rejecting('second')]);
        expect(engine.evaluate(tx(10))).toEqual({ status: 'rejected', reasons: ['first', 'second'] });
    });

    it('approves everything when there are no rules', () => {
        expect(new FraudRulesEngine([]).evaluate(tx(999999)).status).toBe('approved');
    });
});