export enum FraudRuleType {
    AMOUNT_THRESHOLD = 'AMOUNT_THRESHOLD',
    DAILY_LIMIT = 'DAILY_LIMIT',
    VELOCITY_CHECK = 'VELOCITY_CHECK',
    ACCOUNT_BLACKLIST = 'ACCOUNT_BLACKLIST',
    TRANSFER_TYPE_LIMIT = 'TRANSFER_TYPE_LIMIT',
    TIME_BASED = 'TIME_BASED',
}

export enum FraudAction {
    REJECT = 'REJECT',
    APPROVE = 'APPROVE',
    REVIEW = 'REVIEW',
    FLAG = 'FLAG',
}

export interface AmountThresholdCondition {
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
    value: number;
}

export interface DailyLimitCondition {
    maxAmount: number;
    maxTransactions: number;
}

export interface VelocityCheckCondition {
    maxTransactions: number;
    timeWindowMinutes: number;
}

export interface AccountBlacklistCondition {
    accounts: string[];
}

export interface TransferTypeLimitCondition {
    transferTypeId: number;
    maxAmount: number;
}

export interface TimeBasedCondition {
    allowedHours: { start: number; end: number };
    allowedDays: number[];
}

export type FraudRuleCondition =
    | AmountThresholdCondition
    | DailyLimitCondition
    | VelocityCheckCondition
    | AccountBlacklistCondition
    | TransferTypeLimitCondition
    | TimeBasedCondition;

export interface FraudRuleEvaluationResult {
    ruleId: string;
    ruleName: string;
    matched: boolean;
    action: FraudAction;
    reason?: string;
    details?: any;
}

export interface FraudEvaluationContext {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    createdAt: Date;
}
