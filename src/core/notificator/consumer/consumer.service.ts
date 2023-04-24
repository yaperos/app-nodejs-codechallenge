import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, ConsumerSubscribeTopics, Kafka, KafkaMessage } from 'kafkajs';

const server = process.env.SERVER_SNS;
const port = parseInt(process.env.PORT_SNS, 10);
const broker = `${server}:${port}`;

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    dataKafka = `'${process.env.SERVER_SNS}:${process.env.PORT_SNS}'`
    private readonly kafka = new Kafka({ brokers: [broker] });
    private readonly consumer = this.kafka.consumer({ groupId: 'anti-fraud' });
    private readonly consumerUpdate = this.kafka.consumer({ groupId: 'update-data' });

    async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        console.log(this.dataKafka)
        await this.consumer.connect();
        await this.consumer.subscribe(topics);
        await this.consumer.run(config);
    }

    async consumeUpdate(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig){
        await this.consumerUpdate.connect();
        await this.consumerUpdate.subscribe(topics);
        await this.consumerUpdate.run(config);
    }

    async onApplicationShutdown(signal?: string) {
        await this.consumer.disconnect();
        await this.consumerUpdate.disconnect();
    }
}