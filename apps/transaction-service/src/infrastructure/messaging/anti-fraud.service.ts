import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { type Consumer, type EachMessagePayload, Kafka, type Producer } from 'kafkajs';

@Injectable()
export class AntiFraudService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private consumer: Consumer;
    private producer: Producer;

    constructor(private readonly configService: ConfigService) {
        const kafkaBroker = this.configService.get<string>('KAFKA_BROKER');
        if (!kafkaBroker) {
            throw new Error('KAFKA_BROKER environment variable is required');
        }
        this.kafka = new Kafka({
            clientId: 'anti-fraud-service',
            brokers: [kafkaBroker],
        });
        this.consumer = this.kafka.consumer({
            groupId: 'anti-fraud-service-group',
        });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.consumer.connect();
        await this.producer.connect();

        await this.consumer.subscribe({
            topics: ['transaction-created'],
            fromBeginning: false,
        });

        await this.consumer.run({
            eachMessage: this.validateTransaction.bind(this),
        });

        console.log('Anti-Fraud Service started and listening for transactions');
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
        await this.producer.disconnect();
    }

    private async validateTransaction(payload: EachMessagePayload) {
        const { message } = payload;
        if (!message.value) {
            console.error('Received message with null value');
            return;
        }
        const transaction = JSON.parse(message.value.toString());

        console.log('Anti-Fraud validating transaction:', transaction);

        const shouldReject = transaction.value > 1000;

        const resultTopic = shouldReject ? 'transaction-rejected' : 'transaction-approved';

        await this.producer.send({
            topic: resultTopic,
            messages: [
                {
                    key: transaction.transactionExternalId,
                    value: JSON.stringify({
                        transactionExternalId: transaction.transactionExternalId,
                        reason: shouldReject ? 'Value exceeds maximum allowed (1000)' : 'Approved',
                    }),
                },
            ],
        });

        console.log(
            `Transaction ${transaction.transactionExternalId} ${shouldReject ? 'REJECTED' : 'APPROVED'} by Anti-Fraud`,
        );
    }
}
