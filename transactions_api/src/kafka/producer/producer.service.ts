import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
import { KafkaConfig } from "src/config/config";

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
    constructor(private readonly configService: ConfigService) {}

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }
    async onModuleInit() {
        await this.producer.connect();
    }

    private readonly kafka = new Kafka({
        brokers: [this.configService.get<KafkaConfig>("kafka").broker],
    });

    private producer: Producer = this.kafka.producer();

    async produce(record: ProducerRecord) {
        this.producer.send(record);
    }
}
