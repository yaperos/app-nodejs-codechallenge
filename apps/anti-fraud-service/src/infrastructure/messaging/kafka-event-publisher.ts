import { KafkaProducerService, KafkaTopics, TransactionStatus } from '@app/common';
import { Injectable } from '@nestjs/common';
import type { IEventPublisher } from '../../domain/ports/output/event-publisher.interface';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
    constructor(private readonly kafkaProducer: KafkaProducerService) {}

    async publishResult(
        transactionId: string,
        status: TransactionStatus,
        reasons: string[],
        matchedRules: string[],
        correlationId: string,
        causationId: string,
    ): Promise<void> {
        const topic =
            status === TransactionStatus.APPROVED ? KafkaTopics.TRANSACTION_APPROVED : KafkaTopics.TRANSACTION_REJECTED;

        const event = {
            transactionExternalId: transactionId,
            transactionStatus: status,
            reason: reasons.join('; ') || 'Transaction validated successfully',
            matchedRules: matchedRules,
            validatedAt: new Date().toISOString(),
            metadata: {
                correlationId,
                causationId,
                timestamp: new Date().toISOString(),
                service: 'AntiFraudService',
                version: '1.0.0',
            },
        };

        await this.kafkaProducer.sendMessage(topic, transactionId, event);
    }
}
