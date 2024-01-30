/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import config from "apps/api-transactions/src/config";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaAdapterService {
    private kafka: Kafka;

    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>){
        this.kafka = new Kafka({
            clientId : this.configService.KAFKA_CLIENT_ID,
            brokers : [this.configService.KAFKA_BROKERS],
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

    async consumeMessages(topic: string): Promise<void>{
        const group_id= this.configService.KAFKA_CONSUMER_GROUPID;
        const consumer = this.kafka.consumer({ groupId: group_id});
        await consumer.connect();
        await consumer.subscribe({topic});
        await consumer.run({
            eachMessage:async ({ topic, partition, message}) => {
                console.log({
                    value: message.value.toString(),
                });
            },
        });
    }
}