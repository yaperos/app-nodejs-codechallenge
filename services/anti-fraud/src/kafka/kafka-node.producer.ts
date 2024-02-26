import { IProducer } from "@my-org/common-tools";
import { KafkaClient, Producer } from "kafka-node";
import pino, { Logger } from "pino";

export class KafkaNodeProducer implements IProducer {
  private readonly client: KafkaClient;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(private readonly topic: string, broker: string) {
    this.client = new KafkaClient({ kafkaHost: broker });
    this.producer = new Producer(this.client);
    this.logger = pino({ level: "info" });
    this.producer.on("error", (error) => {
      this.logger.error("Error connecting to Kafka:", error);
    });
  }

  async connect() {}

  async produce(message: any) {
    this.producer.send(
      [{ topic: this.topic, messages: JSON.stringify(message) }],
      (error, data) => {
        if (error) {
          this.logger.error("Error in publishing message:", error);
        } else {
          this.logger.info("Message successfully published:", data);
        }
      }
    );
  }

  async disconnect() {
    try {
      this.client.removeAllListeners();
      this.client.close();
    } catch (error) {
      this.logger.error("Error discconnecting to Kafka:", error);
    }
  }
}
