import { Inject, Injectable } from '@nestjs/common';
import type { FraudStatus, TransactionToEvaluate } from '../../domain/models/fraud-evaluation';
import { FRAUD_RULES, type FraudRule } from '../../domain/rules/fraud-rule.interface';

export interface RulesVerdict {
    status: FraudStatus;
    reasons: string[];
}

@Injectable()
export class FraudRulesEngine {
    constructor(@Inject(FRAUD_RULES) private readonly rules: FraudRule[]) { }

    evaluate(transaction: TransactionToEvaluate): RulesVerdict {
        const reasons: string[] = [];
        for (const rule of this.rules) {
            const violation = rule.evaluate(transaction);
            if (violation) reasons.push(violation.reason);
        }
        return { status: reasons.length > 0 ? 'rejected' : 'approved', reasons };
    }
}