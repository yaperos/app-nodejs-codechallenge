import { randomUUID } from 'node:crypto';
import {
    type EventMetadata,
    KafkaProducerService,
    KafkaTopics,
    type TransactionCreatedEvent as KafkaTransactionCreatedEvent,
    type TransactionStatusUpdatedEvent as KafkaTransactionStatusUpdatedEvent,
    type RequestContext,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import type {
    IEventPublisher,
    TransactionCreatedEvent,
    TransactionStatusUpdatedEvent,
} from '../../domain/ports/output/event-publisher.interface';

@Injectable()
export class TransactionEventService implements IEventPublisher {
    constructor(private readonly kafkaProducer: KafkaProducerService) {}

    async publishTransactionCreated(event: TransactionCreatedEvent, context?: Partial<RequestContext>): Promise<void> {
        const metadata: EventMetadata = {
            correlationId: context?.correlationId || randomUUID(),
            causationId: context?.requestId || randomUUID(),
            timestamp: new Date().toISOString(),
            service: 'TransactionService',
            version: '1.0.0',
        };

        const kafkaEvent: KafkaTransactionCreatedEvent = {
            ...event,
            createdAt: event.createdAt.toISOString(),
            metadata,
        };

        await this.kafkaProducer.sendMessage(KafkaTopics.TRANSACTION_CREATED, event.transactionExternalId, kafkaEvent);
        console.log(
            `📤 Published transaction-created: ${event.transactionExternalId} [correlationId: ${metadata.correlationId}]`,
        );
    }

    async publishTransactionStatusUpdated(event: TransactionStatusUpdatedEvent): Promise<void> {
        const topic =
            event.transactionStatus === 'approved'
                ? KafkaTopics.TRANSACTION_APPROVED
                : KafkaTopics.TRANSACTION_REJECTED;

        const kafkaEvent: KafkaTransactionStatusUpdatedEvent = {
            ...event,
            transactionStatus: event.transactionStatus as 'approved' | 'rejected',
            metadata: {
                correlationId: randomUUID(),
                causationId: randomUUID(),
                timestamp: new Date().toISOString(),
                service: 'TransactionService',
                version: '1.0.0',
            },
        };

        await this.kafkaProducer.sendMessage(topic, event.transactionExternalId, kafkaEvent);
        console.log(`📤 Published ${topic}: ${event.transactionExternalId}`);
    }
}
