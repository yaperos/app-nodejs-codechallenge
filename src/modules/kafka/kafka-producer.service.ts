import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'yape-kafka',
            brokers: ['localhost:9092'],
        });
    }

    async connect() {
        this.producer = this.kafka.producer();
        await this.producer.connect();
    }

    async send(topic: string, value: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(value) }],
        });
    }
}