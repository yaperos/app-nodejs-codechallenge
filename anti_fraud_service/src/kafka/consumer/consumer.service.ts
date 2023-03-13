import {
    Injectable,
    Logger,
    OnApplicationShutdown,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    Consumer,
    ConsumerRunConfig,
    ConsumerSubscribeTopics,
    Kafka,
} from "kafkajs";
import { KafkaConfig } from "src/config/config";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {

    constructor(private readonly configService: ConfigService) {}

    private logger = new Logger(ConsumerService.name);
    private kafkaConfig = this.configService.get<KafkaConfig>("kafka");



    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }

    private readonly kafka = new Kafka({
        brokers: [this.kafkaConfig.broker],
    });

    private readonly consumers: Consumer[] = [];

    async consume(
        topic: ConsumerSubscribeTopics,
        config: ConsumerRunConfig,
    ) {
        const cosumer: Consumer = this.kafka.consumer({ groupId: "anti_fraud_consumer_group" });
        await cosumer.connect().catch((err) => this.logger.error(err));
        await cosumer.subscribe(topic);
        await cosumer.run(config);
        this.consumers.push(cosumer);
    }
}
