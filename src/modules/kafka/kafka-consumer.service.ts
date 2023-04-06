import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

type MessageHandler = (message: any) => void;

@Injectable()
export class KafkaConsumerService {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'yape-kafka',
            brokers: ['localhost:9092'],
        });
    }


    async connect(groupId: string) {
        this.consumer = this.kafka.consumer({ groupId });
        await this.consumer.connect();
    }

    async subscribe(topic: string, handler: MessageHandler) {
        await this.consumer.subscribe({ topic });

        this.consumer.run({
            eachMessage: async ({ message }) => {
                const value = JSON.parse(message.value.toString());
                handler(value);
            },
        });
    }
}