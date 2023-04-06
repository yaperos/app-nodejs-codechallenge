import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AppConfigService } from '../@config/app-config.service';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;

    constructor(private readonly appConfigService: AppConfigService) {
        this.kafka = new Kafka({
            clientId: this.appConfigService.getConfig.KAFKA_CLIENT_ID,
            brokers: [this.appConfigService.getConfig.KAFKA_HOST],
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