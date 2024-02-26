import { Logger } from "@nestjs/common";
import { Kafka, Message, Producer } from "kafkajs";
import { IProducer } from "@my-org/common-tools";
import { sleep } from "@my-org/common-tools";

export class KafkajsProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(private readonly topic: string, broker: string) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  async produce(message: Message) {
    await this.producer.send({ topic: this.topic, messages: [message] });
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.error("Failed to connect to Kafka", error);
      sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
