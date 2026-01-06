import type { FraudAction } from '@app/common/types/fraud-rules.types';

export interface FraudRuleExecution {
    ruleId: string;
    transactionExternalId: string;
    matched: boolean;
    action: FraudAction;
    details?: Record<string, any>;
}
