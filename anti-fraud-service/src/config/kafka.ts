import {
  Kafka, Consumer, Producer, KafkaMessage,
} from 'kafkajs';
import { injectable } from 'inversify';
import { EventStreamer, SubscriptionOptions } from './event.streamer.interface';

/**
 * Kafka event streamer client
 * @implements {EventStreamer}
 */
@injectable()
class KafkaClient implements EventStreamer {
  /** Kafka client instance */
  private readonly _client: Kafka;

  /** List of created kafka consumers */
  private consumers: Consumer[];

  /** Kafka producer used to send messages */
  private producer: Producer;

  /**
   * @param {Kafka} client Kafka client to use
   */
  constructor(client: Kafka) {
    this._client = client;
    this.producer = this._client.producer();
    this.consumers = [];
  }

  async closeConnections(): Promise<void> {
    try {
      // Collect all created consumer connections
      const consumerConnections = this.consumers.map((consumer) => consumer.disconnect());

      // Execute all disconnect promises
      await Promise.all(consumerConnections);
    } catch (error) {
      console.error('Error when closing connections');
    }
  }

  async createSubscription(
    { topic, fromBeginning = true }: SubscriptionOptions,
    // eslint-disable-next-line no-unused-vars
    cb: (message: KafkaMessage) => void
  ): Promise<void> {
    try {
      // Create new consumer
      const consumer = this._client.consumer({ groupId: `${topic}-group` });

      // Save consumer on consumers list
      this.consumers.push(consumer);

      // Connect consumer
      await consumer.connect();
      // Suscribe to specified topic
      await consumer.subscribe({ topic, fromBeginning });

      // Start running new consumer
      await consumer.run({
        eachMessage: async ({ topic: msgTopic, partition, message }) => {
          console.info(`New message received for topic ${msgTopic}`, {
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          });
          // Execute callback function
          cb(message);
        },
      });
    } catch (error) {
      console.error('Error when creating new consumer');
    }
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    try {
      // Connect producer
      await this.producer.connect();
      // Send message
      await this.producer.send({
        topic,
        messages: [
          { value: message },
        ],
      });
    } catch (error) {
      console.error(`Error when sending message to ${topic}`);
    } finally {
      // Disconnect producer
      await this.producer.disconnect();
    }
  }
}

export { KafkaClient };
