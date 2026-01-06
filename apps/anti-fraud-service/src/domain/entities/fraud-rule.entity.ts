import type { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';

export class FraudRule {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly ruleType: FraudRuleType,
        public readonly condition: any,
        public readonly action: FraudAction,
        public readonly priority: number,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
