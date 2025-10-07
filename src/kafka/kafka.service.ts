import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, Consumer, Admin } from 'kafkajs';

/**
 * KafkaService provides a high-level interface for interacting with Apache Kafka.
 *
 * This service is configured as a global module and automatically manages
 * connections to Kafka brokers during application lifecycle.
 *
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private readonly kafka: KafkaService) {}
 *
 * // Send a message
 * await this.kafka.sendMessage('my-topic', JSON.stringify({ id: 1, data: 'test' }));
 *
 * // Subscribe to a topic
 * await this.kafka.subscribe('my-topic', async (message) => {
 *   const data = JSON.parse(message);
 *   console.log('Received:', data);
 * });
 * ```
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;
  private readonly logger = new Logger(KafkaService.name);

  /**
   * Initializes Kafka client, producer, consumer, and admin instances.
   * The broker address is read from the KAFKA_BROKER environment variable.
   * Defaults to 'localhost:9092' if not set.
   */
  constructor() {
    this.kafka = new Kafka({
      clientId: 'app-nodejs-codechallenge',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'app-consumer-group',
    });
    this.admin = this.kafka.admin();
  }

  /**
   * Lifecycle hook that connects to Kafka when the module initializes.
   * Establishes connections for producer, consumer, and admin clients.
   */
  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.admin.connect();
  }

  /**
   * Lifecycle hook that disconnects from Kafka when the module is destroyed.
   * Ensures graceful shutdown of all Kafka connections.
   */
  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.admin.disconnect();
  }

  /**
   * Sends a message to a Kafka topic.
   *
   * @param topic - The name of the Kafka topic
   * @param message - The message content as a string (use JSON.stringify for objects)
   * @returns Promise that resolves with the send result metadata
   *
   * @example
   * ```typescript
   * const transaction = { id: '123', amount: 100 };
   * await this.kafka.sendMessage('transactions', JSON.stringify(transaction));
   * ```
   */
  async sendMessage(topic: string, message: string) {
    this.logger.log('Message sent:', message);
    return this.producer.send({
      topic,
      messages: [
        {
          value: message,
        },
      ],
    });
  }

  /**
   * Subscribes to a Kafka topic and processes messages with a callback function.
   *
   * @param topic - The name of the Kafka topic to subscribe to
   * @param callback - Async function to process each message
   *
   * @example
   * ```typescript
   * await this.kafka.subscribe('transactions', async (message) => {
   *   const transaction = JSON.parse(message);
   *   console.log('Processing transaction:', transaction.id);
   * });
   * ```
   *
   * @remarks
   * - Messages are consumed from the current offset (fromBeginning: false)
   * - The consumer belongs to the 'transaction-group' consumer group
   * - Multiple instances will share the load within the same consumer group
   */
  async subscribe(topic: string, callback: (message: string) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          this.logger.log('Message received:', value);
          await callback(value);
        }
      },
    });
  }

  /**
   * Creates a new Kafka topic if it doesn't already exist.
   *
   * @param topic - The name of the topic to create
   * @param numPartitions - Number of partitions for the topic (default: 1)
   *
   * @example
   * ```typescript
   * // Create a topic with 1 partition
   * await this.kafka.createTopic('transactions');
   *
   * // Create a topic with 3 partitions for better parallelism
   * await this.kafka.createTopic('high-volume-events', 3);
   * ```
   *
   * @remarks
   * This method checks if the topic exists before creating it to avoid errors.
   */
  async createTopic(topic: string, numPartitions = 1) {
    const topics = await this.admin.listTopics();
    if (!topics.includes(topic)) {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions }],
      });
    }
  }

  /**
   * Returns the underlying KafkaJS Producer instance.
   * Use this for advanced producer operations not covered by sendMessage().
   *
   * @returns The KafkaJS Producer instance
   */
  getProducer(): Producer {
    return this.producer;
  }

  /**
   * Returns the underlying KafkaJS Consumer instance.
   * Use this for advanced consumer operations not covered by subscribe().
   *
   * @returns The KafkaJS Consumer instance
   */
  getConsumer(): Consumer {
    return this.consumer;
  }

  /**
   * Returns the underlying KafkaJS Admin instance.
   * Use this for advanced admin operations like managing ACLs, configs, etc.
   *
   * @returns The KafkaJS Admin instance
   */
  getAdmin(): Admin {
    return this.admin;
  }

  /**
   * Creates a new consumer instance with a custom group ID.
   * Useful when you need multiple independent consumer groups.
   *
   * @param groupId - The consumer group ID
   * @returns A new Consumer instance
   *
   * @example
   * ```typescript
   * const consumer = this.kafka.createConsumer('my-service-group');
   * await consumer.connect();
   * await consumer.subscribe({ topic: 'my-topic' });
   * await consumer.run({
   *   eachMessage: async ({ message }) => {
   *     console.log(message.value?.toString());
   *   }
   * });
   * ```
   */
  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}
