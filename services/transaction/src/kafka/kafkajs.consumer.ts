import { Logger } from "@nestjs/common";
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from "kafkajs";
import { IConsumer } from "@my-org/common-tools";
import { sleep } from "@my-org/common-tools";

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    config: ConsumerConfig,
    broker: string
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }
  async connect() {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.logger.error("Failed to connect to Kafka", error);
      sleep(5000);
      await this.connect();
    }
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        await onMessage(message);
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
