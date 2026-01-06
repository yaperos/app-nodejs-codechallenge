import {
    type AccountBlacklistCondition,
    type AmountThresholdCondition,
    type DailyLimitCondition,
    FraudAction,
    type FraudEvaluationContext,
    type FraudRuleEvaluationResult,
    FraudRuleType,
    type TimeBasedCondition,
    type TransferTypeLimitCondition,
    type VelocityCheckCondition,
} from '@app/common/types/fraud-rules.types';
import { Inject, Injectable } from '@nestjs/common';
import type { FraudRule } from '../entities/fraud-rule.entity';
import { FRAUD_RULE_REPOSITORY, type IFraudRuleRepository } from '../repositories/fraud-rule.repository.interface';

@Injectable()
export class RulesEngineService {
    constructor(
        @Inject(FRAUD_RULE_REPOSITORY)
        private readonly fraudRuleRepository: IFraudRuleRepository,
    ) {}

    async evaluateTransaction(context: FraudEvaluationContext): Promise<FraudRuleEvaluationResult[]> {
        const activeRules = await this.fraudRuleRepository.findActiveRules();

        const results: FraudRuleEvaluationResult[] = [];

        for (const rule of activeRules) {
            const result = await this.evaluateRule(rule, context);
            results.push(result);

            await this.logRuleExecution(rule.id, context.transactionExternalId, result);
        }

        return results;
    }

    private async evaluateRule(rule: FraudRule, context: FraudEvaluationContext): Promise<FraudRuleEvaluationResult> {
        const baseResult: FraudRuleEvaluationResult = {
            ruleId: rule.id,
            ruleName: rule.name,
            matched: false,
            action: rule.action as FraudAction,
        };

        try {
            switch (rule.ruleType as FraudRuleType) {
                case FraudRuleType.AMOUNT_THRESHOLD:
                    return this.evaluateAmountThreshold(rule, context, baseResult);

                case FraudRuleType.DAILY_LIMIT:
                    return await this.evaluateDailyLimit(rule, context, baseResult);

                case FraudRuleType.VELOCITY_CHECK:
                    return await this.evaluateVelocityCheck(rule, context, baseResult);

                case FraudRuleType.ACCOUNT_BLACKLIST:
                    return this.evaluateAccountBlacklist(rule, context, baseResult);

                case FraudRuleType.TRANSFER_TYPE_LIMIT:
                    return this.evaluateTransferTypeLimit(rule, context, baseResult);

                case FraudRuleType.TIME_BASED:
                    return this.evaluateTimeBased(rule, context, baseResult);

                default:
                    return {
                        ...baseResult,
                        reason: `Unknown rule type: ${rule.ruleType}`,
                    };
            }
        } catch (error) {
            console.error(`Error evaluating rule ${rule.name}:`, error);
            return {
                ...baseResult,
                reason: `Evaluation error: ${error.message}`,
            };
        }
    }

    private evaluateAmountThreshold(
        rule: FraudRule,
        context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): FraudRuleEvaluationResult {
        const condition = rule.condition as AmountThresholdCondition;
        let matched = false;

        switch (condition.operator) {
            case 'gt':
                matched = context.value > condition.value;
                break;
            case 'gte':
                matched = context.value >= condition.value;
                break;
            case 'lt':
                matched = context.value < condition.value;
                break;
            case 'lte':
                matched = context.value <= condition.value;
                break;
            case 'eq':
                matched = context.value === condition.value;
                break;
        }

        return {
            ...baseResult,
            matched,
            reason: matched
                ? `Transaction amount ${context.value} ${condition.operator} ${condition.value}`
                : undefined,
            details: { value: context.value, threshold: condition.value },
        };
    }

    private async evaluateDailyLimit(
        rule: FraudRule,
        _context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): Promise<FraudRuleEvaluationResult> {
        const _condition = rule.condition as DailyLimitCondition;

        return {
            ...baseResult,
            matched: false,
            reason: 'Daily limit check - implementation pending',
        };
    }

    private async evaluateVelocityCheck(
        rule: FraudRule,
        _context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): Promise<FraudRuleEvaluationResult> {
        const _condition = rule.condition as VelocityCheckCondition;

        return {
            ...baseResult,
            matched: false,
            reason: 'Velocity check - implementation pending',
        };
    }

    private evaluateAccountBlacklist(
        rule: FraudRule,
        context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): FraudRuleEvaluationResult {
        const condition = rule.condition as AccountBlacklistCondition;

        const isBlacklisted =
            condition.accounts.includes(context.accountExternalIdDebit) ||
            condition.accounts.includes(context.accountExternalIdCredit);

        return {
            ...baseResult,
            matched: isBlacklisted,
            reason: isBlacklisted ? 'Account is in blacklist' : undefined,
            details: {
                debitAccount: context.accountExternalIdDebit,
                creditAccount: context.accountExternalIdCredit,
            },
        };
    }

    private evaluateTransferTypeLimit(
        rule: FraudRule,
        context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): FraudRuleEvaluationResult {
        const condition = rule.condition as TransferTypeLimitCondition;

        const matched = context.transferTypeId === condition.transferTypeId && context.value > condition.maxAmount;

        return {
            ...baseResult,
            matched,
            reason: matched
                ? `Transfer type ${context.transferTypeId} exceeds limit of ${condition.maxAmount}`
                : undefined,
            details: {
                transferTypeId: context.transferTypeId,
                value: context.value,
                maxAmount: condition.maxAmount,
            },
        };
    }

    private evaluateTimeBased(
        rule: FraudRule,
        context: FraudEvaluationContext,
        baseResult: FraudRuleEvaluationResult,
    ): FraudRuleEvaluationResult {
        const condition = rule.condition as TimeBasedCondition;
        const date = new Date(context.createdAt);
        const hour = date.getHours();
        const day = date.getDay();

        const hourAllowed = hour >= condition.allowedHours.start && hour <= condition.allowedHours.end;
        const dayAllowed = condition.allowedDays.includes(day);

        const matched = !hourAllowed || !dayAllowed;

        return {
            ...baseResult,
            matched,
            reason: matched ? 'Transaction outside allowed time window' : undefined,
            details: {
                hour,
                day,
                allowedHours: condition.allowedHours,
                allowedDays: condition.allowedDays,
            },
        };
    }

    private async logRuleExecution(
        ruleId: string,
        transactionId: string,
        result: FraudRuleEvaluationResult,
    ): Promise<void> {
        await this.fraudRuleRepository.logExecution({
            ruleId,
            transactionExternalId: transactionId,
            matched: result.matched,
            action: result.action,
            details: result.details || {},
        });
    }

    determineFinalAction(results: FraudRuleEvaluationResult[]): {
        action: FraudAction;
        matchedRules: FraudRuleEvaluationResult[];
        reasons: string[];
    } {
        const matchedRules = results.filter((r) => r.matched);

        if (matchedRules.length === 0) {
            return {
                action: FraudAction.APPROVE,
                matchedRules: [],
                reasons: ['No fraud rules matched'],
            };
        }

        const actionPriority = {
            [FraudAction.REJECT]: 4,
            [FraudAction.REVIEW]: 3,
            [FraudAction.FLAG]: 2,
            [FraudAction.APPROVE]: 1,
        };

        let finalAction = FraudAction.APPROVE;
        let maxPriority = 0;

        for (const rule of matchedRules) {
            const priority = actionPriority[rule.action];
            if (priority > maxPriority) {
                maxPriority = priority;
                finalAction = rule.action;
            }
        }

        const reasons = matchedRules.filter((r) => r.reason).map((r) => `${r.ruleName}: ${r.reason}`);

        return {
            action: finalAction,
            matchedRules,
            reasons,
        };
    }
}
