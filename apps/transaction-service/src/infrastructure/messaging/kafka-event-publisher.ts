import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { Kafka, type Producer } from 'kafkajs';
import type {
    IEventPublisher,
    TransactionCreatedEvent,
    TransactionStatusUpdatedEvent,
} from '../../domain/ports/output/event-publisher.interface';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher, OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;

    constructor(private readonly configService: ConfigService) {
        const kafkaBroker = this.configService.get<string>('KAFKA_BROKER');
        if (!kafkaBroker) {
            throw new Error('KAFKA_BROKER environment variable is required');
        }
        this.kafka = new Kafka({
            clientId: 'transaction-service',
            brokers: [kafkaBroker],
        });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async publishTransactionCreated(event: TransactionCreatedEvent): Promise<void> {
        await this.producer.send({
            topic: 'transaction-created',
            messages: [
                {
                    key: event.transactionExternalId,
                    value: JSON.stringify(event),
                },
            ],
        });
    }

    async publishTransactionStatusUpdated(event: TransactionStatusUpdatedEvent): Promise<void> {
        await this.producer.send({
            topic: 'transaction-status-updated',
            messages: [
                {
                    key: event.transactionExternalId,
                    value: JSON.stringify(event),
                },
            ],
        });
    }
}
