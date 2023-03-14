import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
import { KafkaConfig } from "src/config/config";

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
    constructor(private readonly configService: ConfigService) {}

    private kafkaConfig = this.configService.get<KafkaConfig>("kafka");

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }
    async onModuleInit() {
        await this.producer.connect();
    }

    private readonly kafka = new Kafka({
        brokers: [`${this.kafkaConfig.host}:${this.kafkaConfig.port}`],
    });

    private producer: Producer = this.kafka.producer();

    async produce(record: ProducerRecord) {
        this.producer.send(record);
    }
}
