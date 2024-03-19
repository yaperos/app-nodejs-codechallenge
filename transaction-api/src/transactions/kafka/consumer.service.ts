import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers:['localhost:9092']
    });

    private readonly consumer: Consumer[] = [];

    async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        const  consumer = this.kafka.consumer({groupId: 'kafka-consumer'});
        await consumer.connect();
        await consumer.subscribe(topic);
        await consumer.run(config);
        this.consumer.push(consumer);
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumer) {
            await consumer.disconnect();
        }
    }
}