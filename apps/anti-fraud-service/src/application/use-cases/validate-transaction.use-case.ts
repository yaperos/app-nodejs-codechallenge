import { FraudAction, type FraudEvaluationContext } from '@app/common/types/fraud-rules.types';
import { LoggerService } from '@app/observability';
import { Inject, Injectable } from '@nestjs/common';
import type { IValidateTransactionUseCase } from '../../domain/ports/input/validate-transaction.use-case.interface';
import { EVENT_PUBLISHER, type IEventPublisher } from '../../domain/ports/output/event-publisher.interface';
import { RulesEngineService } from '../../domain/services/rules-engine.service';

@Injectable()
export class ValidateTransactionUseCase implements IValidateTransactionUseCase {
    constructor(
        private readonly rulesEngine: RulesEngineService,
        private readonly logger: LoggerService,
        @Inject(EVENT_PUBLISHER)
        private readonly eventPublisher: IEventPublisher,
    ) {}

    async execute(
        transactionId: string,
        value: number,
        accountExternalIdDebit: string,
        accountExternalIdCredit: string,
        transferTypeId: number,
        createdAt: Date,
        metadata: { correlationId: string; causationId: string; service: string },
    ): Promise<void> {
        const requestContext = {
            correlationId: metadata.correlationId,
            requestId: metadata.causationId,
            service: metadata.service,
        };

        this.logger.log('Validating transaction', requestContext, {
            transactionId,
            value,
            transferTypeId,
        });

        const context: FraudEvaluationContext = {
            transactionExternalId: transactionId,
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value,
            createdAt,
        };

        const ruleResults = await this.rulesEngine.evaluateTransaction(context);
        const { action, matchedRules, reasons } = this.rulesEngine.determineFinalAction(ruleResults);

        let status: string;
        switch (action) {
            case FraudAction.REJECT:
            case FraudAction.REVIEW:
            case FraudAction.FLAG:
                status = 'rejected';
                break;
            default:
                status = 'approved';
        }

        await this.eventPublisher.publishResult(
            transactionId,
            status,
            reasons,
            matchedRules.map((r) => r.ruleName),
            metadata.correlationId,
            metadata.causationId,
        );

        if (action === FraudAction.REJECT) {
            this.logger.warn(`Transaction ${action.toLowerCase()}`, requestContext, {
                transactionId,
                action,
                value,
                matchedRules: matchedRules.map((r) => r.ruleName),
                reasons,
            });
        } else {
            this.logger.log(`Transaction ${action.toLowerCase()}`, requestContext, {
                transactionId,
                action,
                value,
                matchedRules: matchedRules.map((r) => r.ruleName),
                reasons,
            });
        }
    }
}
