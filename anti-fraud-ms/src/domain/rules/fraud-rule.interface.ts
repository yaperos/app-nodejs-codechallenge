import type { TransactionToEvaluate } from '../models/fraud-evaluation';

export interface RuleViolation {
    rule: string;
    reason: string;
}

export interface FraudRule {
    readonly name: string;
    evaluate(transaction: TransactionToEvaluate): RuleViolation | null;
}

export const FRAUD_RULES = Symbol('FRAUD_RULES');