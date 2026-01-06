import type { FraudRule } from '../entities/fraud-rule.entity';
import type { FraudRuleExecution } from '../types/fraud-rule-execution.type';

export interface IFraudRuleRepository {
    findActiveRules(): Promise<FraudRule[]>;
    logExecution(execution: FraudRuleExecution): Promise<void>;
}

export const FRAUD_RULE_REPOSITORY = 'FRAUD_RULE_REPOSITORY';
