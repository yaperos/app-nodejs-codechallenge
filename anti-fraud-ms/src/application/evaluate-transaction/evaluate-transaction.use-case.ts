import { Injectable, Logger } from '@nestjs/common';
import type { TransactionCreatedEvent } from '@yape/contracts';

import { FraudRulesEngine } from './fraud-rules.engine';
import { EvaluationPublisherPort, } from '../../domain/ports/evaluation-publisher.port';
import { ProcessedMessageStorePort } from '../../domain/ports/processed-message.store.port';

@Injectable()
export class EvaluateTransactionUseCase {
    private readonly logger = new Logger(EvaluateTransactionUseCase.name);

    constructor(
        private readonly engine: FraudRulesEngine,
        private readonly publisher: EvaluationPublisherPort,
        private readonly processed: ProcessedMessageStorePort,
    ) { }

    async execute(event: TransactionCreatedEvent): Promise<void> {
        if (await this.processed.wasProcessed(event.eventId)) {
            this.logger.warn(`Event ${event.eventId} already processed, skipping`);
            return;
        }

        const { data } = event;
        const verdict = this.engine.evaluate({
            transactionId: data.transactionExternalId,
            accountExternalIdDebit: data.accountExternalIdDebit,
            accountExternalIdCredit: data.accountExternalIdCredit,
            transferTypeId: data.transferTypeId,
            value: data.value,
        });
        await this.publisher.publish({
            sourceEventId: event.eventId,
            transactionId: data.transactionExternalId,
            status: verdict.status,
            reasons: verdict.reasons,
        });
        await this.processed.markProcessed(event.eventId);

        this.logger.log(`Transaction ${data.transactionExternalId} -> ${verdict.status}`);
    }
}