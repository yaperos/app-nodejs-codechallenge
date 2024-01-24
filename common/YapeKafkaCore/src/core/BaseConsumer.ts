import { Consumer } from "kafkajs";
import { KafkaConnection } from "./KafkaConnection";

class BaseConsumer<T = any> {
  private topic: string;
  private consumer: Consumer;

  /**
   * Creates an instance of BaseConsumer.
   * @param {KafkaConnection} kafkaInstance - The KafkaConnection instance to be used.
   * @param {string} groupTag - The tag to be used in the consumer group.
   */
  constructor(private kafkaInstance: KafkaConnection, groupTag: string) {
    this.topic = kafkaInstance.topic;
    this.consumer = kafkaInstance.kafka.consumer({
      groupId: `${groupTag}-${this.topic}`.toLowerCase(),
    });
  }

  /**
   * Subscribes to the Kafka topic and starts consuming messages.
   * @param {(message: T, topic: string, partition: number) => void} messageHandler - The function that will be called for each message consumed.
   */
  async subscribe(
    messageHandler: (message: T, topic: string, partition: number) => void
  ) {
    await this.kafkaInstance.ensureTopicExists();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        messageHandler(
          JSON.parse(message.value?.toString() || "{}"),
          topic,
          partition
        );
      },
    });
  }

  /**
   * Disconnects the consumer from Kafka.
   */
  async disconnect() {
    await this.consumer.disconnect();
  }
}

export { BaseConsumer };
