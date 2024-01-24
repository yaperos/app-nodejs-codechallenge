import { Producer } from "kafkajs";
import { KafkaConnection } from "./KafkaConnection";

class BasePublisher<T = any> {
  private kafkaInstance: KafkaConnection;
  private topic: string;
  private producer: Producer;
  private isConnected: boolean;

  /**
   * Creates an instance of BasePublisher.
   * @param {KafkaConnection} kafkaInstance - The KafkaConnection instance to be used.
   */
  constructor(kafkaInstance: KafkaConnection) {
    this.kafkaInstance = kafkaInstance;
    this.topic = kafkaInstance.topic;
    this.producer = kafkaInstance.kafka.producer();
    this.isConnected = false;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    const { CONNECT, DISCONNECT } = this.producer.events;

    this.producer.on(CONNECT, () => {
      console.log("[PRODUCER] Conectado exitosamente a Kafka");
      this.isConnected = true;
    });

    this.producer.on(DISCONNECT, () => {
      console.log("[PRODUCER] Desconectado de Kafka");
      this.isConnected = false;
    });
  }

  private async connect() {
    if (!this.isConnected) {
      await this.kafkaInstance.ensureTopicExists();
      await this.producer.connect();
    }
  }

  /**
   * Publishes a message to the Kafka topic.
   * @param {T} message - The message to be published.
   * @throws {Error} Propagates any error that occurs during the publishing process.
   */
  async publish(message: T) {
    await this.connect();
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
    }
  }
}

export { BasePublisher };
