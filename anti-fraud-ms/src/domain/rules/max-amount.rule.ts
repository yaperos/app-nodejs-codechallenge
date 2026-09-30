import type { TransactionToEvaluate } from '../models/fraud-evaluation';
import type { FraudRule, RuleViolation } from './fraud-rule.interface';


export class MaxAmountRule implements FraudRule {
    readonly name = 'max-amount';

    constructor(private readonly maxAmount: number) { }

    evaluate(transaction: TransactionToEvaluate): RuleViolation | null {
        if (transaction.value > this.maxAmount) {
            return {
                rule: this.name,
                reason: `Value ${transaction.value} exceeds the maximum allowed amount of ${this.maxAmount}`,
            };
        }
        return null;
    }
}