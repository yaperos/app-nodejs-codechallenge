import type { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { FraudRule } from '../../domain/entities/fraud-rule.entity';
import type { FraudRule as FraudRuleSchema } from '../../infrastructure/database/fraud-rules.schema';

export class FraudRuleMapper {
    static toDomain(schema: FraudRuleSchema): FraudRule {
        return new FraudRule(
            schema.id,
            schema.name,
            schema.description,
            schema.ruleType as FraudRuleType,
            schema.condition,
            schema.action as FraudAction,
            schema.priority,
            schema.isActive,
            schema.createdAt,
            schema.updatedAt,
        );
    }
}
