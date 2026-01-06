import type { UpdateTransactionStatusUseCase } from '@application/use-cases/update-transaction-status.use-case';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { type Consumer, type EachMessagePayload, Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(
        private readonly configService: ConfigService,
        private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    ) {
        const kafkaBroker = this.configService.get<string>('KAFKA_BROKER');
        if (!kafkaBroker) {
            throw new Error('KAFKA_BROKER environment variable is required');
        }
        this.kafka = new Kafka({
            clientId: 'transaction-service-consumer',
            brokers: [kafkaBroker],
        });
        this.consumer = this.kafka.consumer({
            groupId: 'transaction-service-group',
        });
    }

    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topics: ['transaction-approved', 'transaction-rejected'],
            fromBeginning: false,
        });

        await this.consumer.run({
            eachMessage: this.handleMessage.bind(this),
        });
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }

    private async handleMessage(payload: EachMessagePayload) {
        const { topic, message } = payload;
        if (!message.value) {
            console.error('Received message with null value');
            return;
        }
        const event = JSON.parse(message.value.toString());

        console.log(`Received event from topic ${topic}:`, event);

        if (topic === 'transaction-approved') {
            await this.updateTransactionStatusUseCase.execute(event.transactionExternalId, TransactionStatus.APPROVED);
            console.log(`Transaction ${event.transactionExternalId} approved successfully`);
        } else if (topic === 'transaction-rejected') {
            await this.updateTransactionStatusUseCase.execute(event.transactionExternalId, TransactionStatus.REJECTED);
            console.log(`Transaction ${event.transactionExternalId} rejected successfully`);
        }
    }
}
