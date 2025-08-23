import { Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { EventPublishInterface } from '../../../Domain/Interfaces/EventPublishInterface';
import { MessageStatusModel } from '../../../Domain/Models/MessageStatusModel';

export class KafkaEventPublish implements EventPublishInterface {
    private producerKafka: Producer;
    private readonly logger = new Logger(KafkaEventPublish.name);

    constructor(
        private readonly kafka: Kafka,
        private readonly topic: string
    ) {
        this.producerKafka = this.kafka.producer({
            allowAutoTopicCreation: false,
            idempotent: true,
            maxInFlightRequests: 1,
            retry: { retries: 10 }
        });
    }

    async connect(): Promise<void> {
        await this.producerKafka.connect();
    }

    async publish(messageBroker: MessageStatusModel): Promise<void> {
        await this.connect();
        this.logger.log(`publish: ${JSON.stringify(messageBroker)}`);
        try {
            await this.producerKafka.send({
                topic: this.topic,
                acks: -1,
                messages: [{
                    value: JSON.stringify({
                        transactionExternalId: messageBroker.transactionExternalId,
                        status: messageBroker.status,
                        reason: messageBroker.reason,
                        validatedAt: messageBroker.validatedAt.toISOString()
                    })
                }]
            });
        } finally {
            await this.disconnect();
        }
    }

    async disconnect(): Promise<void> {
        await this.producerKafka.disconnect();
    }
}
