import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import config from '../../../config';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, KafkaMessage } from "kafkajs";

@Injectable()
export class KafkaClientService {
    private readonly logger = new Logger(KafkaClientService.name)
    private kafka: Kafka;
    private readonly consumers: Consumer[] = [];

    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>) {
        this.kafka = new Kafka({
            clientId: this.configService.KAFKA_CLIENT_ID,
            brokers: [this.configService.KAFKA_BROKERS],
        });
    }

    async sendMessage(topic: string, key: string, message: any): Promise<void> {
        const producer = await this.kafka.producer();
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(message)
                }
            ]
        });
        await producer.disconnect();
    }

    /*async consumeMessages(topic: string, callback?: (message: KafkaMessage) => void): Promise<void> {
        const group_id = this.configService.KAFKA_CONSUMER_GROUPID;
        const consumer = this.kafka.consumer({ groupId: group_id });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.logger.log({
                    value: message.value.toString(),
                });
                if (callback) callback(message)
            },
        });
        this.consumers.push(consumer);
    }*/

    async consumeMessagesWithConfig(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig, group_id: string ): Promise<void> {
        const consumer = this.kafka.consumer({ groupId: group_id });
        await consumer.connect();
        await consumer.subscribe(topic);
        await consumer.run(config);
        this.consumers.push(consumer);
    }

    async onApplicationShutdown(){
        for(const consumer of this.consumers){
            await consumer.disconnect();
        }
    }
}