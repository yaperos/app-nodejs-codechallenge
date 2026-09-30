import { Injectable } from '@nestjs/common';
import { Topics, type TransactionStatusUpdatedEvent } from '@yape/contracts';
import type { FraudEvaluation } from '../../domain/models/fraud-evaluation';
import { EvaluationPublisherPort } from '../../domain/ports/evaluation-publisher.port';
import { deterministicGuid } from './deterministic-guid';
import { KafkaProducer } from './kafka.producer';

@Injectable()
export class KafkaEvaluationPublisher extends EvaluationPublisherPort {
    constructor(private readonly producer: KafkaProducer) {
        super();
    }

    async publish(evaluation: FraudEvaluation): Promise<void> {
        const event: TransactionStatusUpdatedEvent = {
            eventId: deterministicGuid(`${Topics.TRANSACTION_STATUS_UPDATED}:${evaluation.sourceEventId}`),
            eventType: 'transaction.status-updated',
            version: 1,
            occurredAt: new Date().toISOString(),
            data: {
                transactionExternalId: evaluation.transactionId,
                status: evaluation.status,
                reason: evaluation.reasons.length > 0 ? evaluation.reasons.join('; ') : undefined,
            },
        };

        await this.producer.send({
            topic: Topics.TRANSACTION_STATUS_UPDATED,
            key: evaluation.transactionId, // misma key => misma partición => orden por transacción
            value: JSON.stringify(event),
            headers: { 'event-id': event.eventId, 'content-type': 'application/json' },
        });
    }
}