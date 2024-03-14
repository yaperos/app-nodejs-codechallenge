import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, Kafka } from "kafkajs";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
        clientId: 'nestjs-kafka',
    });

    private readonly consumers: Consumer[] = [];

    async consume(topic: string, config: ConsumerRunConfig) {
        const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run(config);
        return this.consumers.push(consumer);
    }
    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
