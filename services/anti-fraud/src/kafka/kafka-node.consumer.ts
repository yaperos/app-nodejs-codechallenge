import { Consumer, KafkaClient } from "kafka-node";
import { IConsumer, sleep } from "@my-org/common-tools";
import pino, { Logger } from "pino";

export class KafkaNodeConsumer implements IConsumer {
  private readonly client: KafkaClient;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(private readonly topic: string, broker: string) {
    this.client = new KafkaClient({ kafkaHost: broker });
    this.consumer = new Consumer(this.client, [{ topic: this.topic }], {});
    this.logger = pino({ level: "error" });
    this.consumer.on("error", (error) => {
      this.logger.error("Error connecting to Kafka:", error);
      sleep(5000);
      this.consumer.resume();
    });
  }

  async connect() {}

  async consume(onMessage: (message: string) => Promise<void>) {
    this.consumer.on("message", async (message) => {
      await onMessage(message.value.toString());
    });
  }

  async disconnect() {
    try {
      this.client.removeAllListeners();
      this.client.close();
    } catch (error) {
      this.logger.error("Error disconnecting to Kafka:", error);
    }
  }
}
