import { DRIZZLE_CLIENT, type DrizzleClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { FraudRule } from '../../domain/entities/fraud-rule.entity';
import type { IFraudRuleRepository } from '../../domain/repositories/fraud-rule.repository.interface';
import type { FraudRuleExecution } from '../../domain/types/fraud-rule-execution.type';
import { fraudRuleExecutions, fraudRules, type NewFraudRuleExecution } from '../database/fraud-rules.schema';
import { FraudRuleMapper } from '../mappers/fraud-rule.mapper';

@Injectable()
export class FraudRuleRepository implements IFraudRuleRepository {
    constructor(
        @Inject(DRIZZLE_CLIENT)
        private readonly db: DrizzleClient,
    ) {}

    async findActiveRules(): Promise<FraudRule[]> {
        const rules = await this.db
            .select()
            .from(fraudRules)
            .where(eq(fraudRules.isActive, true))
            .orderBy(fraudRules.priority);

        return rules.map(FraudRuleMapper.toDomain);
    }

    async logExecution(execution: FraudRuleExecution): Promise<void> {
        const schemaExecution: NewFraudRuleExecution = {
            ruleId: execution.ruleId,
            transactionExternalId: execution.transactionExternalId,
            matched: execution.matched,
            action: execution.action,
            details: execution.details,
        };

        await this.db.insert(fraudRuleExecutions).values(schemaExecution);
    }
}
