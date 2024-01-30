import { Injectable } from '@nestjs/common';
import { Kafka, KafkaMessage } from 'kafkajs';
import { AppService } from 'src/app.service';

@Injectable()
export class KafkaService {
    private kafka: Kafka;
    private producer;
    private consumer;

    constructor() {
        this.kafka = new Kafka({
            brokers: [AppService.kafka_broker],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'group-transaction' });
        this.connectConsumer();
    }

    private async connectConsumer() {
        await this.consumer.connect();
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                const callback = this.callbacks[topic];
                if (callback) {
                    await callback(message);
                }
            },
        });
    }

    private callbacks: { [key: string]: (message: KafkaMessage) => Promise<void> } = {};

    async sendMessage(topic: string, message: any) {
        await this.producer.connect();
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async subscribeToTopic(topic: string, callback: (message: KafkaMessage) => Promise<void>) {
        this.callbacks[topic] = callback;
        await this.consumer.subscribe({ topic });
    }
}