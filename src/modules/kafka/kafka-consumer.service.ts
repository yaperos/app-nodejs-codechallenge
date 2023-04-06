import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { AppConfigService } from '../@config/app-config.service';

type MessageHandler = (message: any) => void;

@Injectable()
export class KafkaConsumerService {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(private readonly appConfigService: AppConfigService) {
        this.kafka = new Kafka({
            clientId: this.appConfigService.getConfig.KAFKA_CLIENT_ID,
            brokers: [this.appConfigService.getConfig.KAFKA_HOST],
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