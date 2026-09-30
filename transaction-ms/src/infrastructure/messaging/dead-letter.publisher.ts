import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { type DeadLetterMessage, dlqTopicFor } from '@yape/contracts';
import type { ConsumedMessage } from '../../application/ports/message-consumer.port';
import { KafkaProducer } from './kafka.producer';

@Injectable()
export class DeadLetterPublisher {
    private readonly logger = new Logger(DeadLetterPublisher.name);

    constructor(
        private readonly producer: KafkaProducer,
    ) { }

    async publish(params: {
        consumerGroup: string;
        message: ConsumedMessage;
        error: unknown;
    }): Promise<void> {
        const { consumerGroup, message } = params;
        const error = params.error instanceof Error ? params.error : new Error(String(params.error));

        const deadLetter: DeadLetterMessage = {
            originalTopic: message.topic,
            consumerGroup,
            key: message.key,
            value: message.value,
            headers: message.headers,
            error: { name: error.name, message: error.message },
            failedAt: new Date().toISOString(),
        };

        await this.producer.send({
            topic: dlqTopicFor(message.topic),
            key: message.key ?? randomUUID(),
            value: JSON.stringify(deadLetter),
            headers: { 'x-original-topic': message.topic, 'x-error-name': error.name },
        });

        this.logger.error(
            `Message sent to DLQ (topic=${message.topic}, group=${consumerGroup}): ${error.message}`,
        );
    }
}