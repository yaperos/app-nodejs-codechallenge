import { Kafka, Producer, Consumer, EachMessagePayload, Admin, IHeaders } from 'kafkajs';

interface KafkaMessage {
  key?: string | null;
  value?: unknown;
  headers?: IHeaders;
  [key: string]: unknown;
}

interface ConsumedMessage {
  key: string | undefined;
  value: unknown;
  headers: IHeaders | undefined;
  offset: string;
}

export class TestKafkaHelper {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private admin: Admin;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'test-client',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 3,
      },
    });

    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.admin.connect();
  }

  async disconnect(): Promise<void> {
    for (const [, consumer] of this.consumers) {
      await consumer.disconnect();
    }
    this.consumers.clear();

    await this.producer.disconnect();
    await this.admin.disconnect();
  }

  async createTopic(topic: string, numPartitions: number = 1): Promise<void> {
    const topics = await this.admin.listTopics();

    if (!topics.includes(topic)) {
      await this.admin.createTopics({
        topics: [
          {
            topic,
            numPartitions,
            replicationFactor: 1,
          },
        ],
      });
    }
  }

  async deleteTopic(topic: string): Promise<void> {
    const topics = await this.admin.listTopics();

    if (topics.includes(topic)) {
      await this.admin.deleteTopics({
        topics: [topic],
      });
    }
  }

  async publishMessage(topic: string, message: KafkaMessage): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.key || null,
          value: JSON.stringify(message.value || message),
          headers: message.headers || {},
        },
      ],
    });
  }

  async publishMessages(topic: string, messages: KafkaMessage[]): Promise<void> {
    await this.producer.send({
      topic,
      messages: messages.map(msg => ({
        key: msg.key || null,
        value: JSON.stringify(msg.value || msg),
        headers: msg.headers || {},
      })),
    });
  }

  async createConsumer(
    groupId: string,
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: true });

    await consumer.run({
      eachMessage: handler,
    });

    this.consumers.set(groupId, consumer);
    return consumer;
  }

  async consumeMessages(
    topic: string,
    groupId: string,
    expectedCount: number,
    timeout: number = 10000,
  ): Promise<ConsumedMessage[]> {
    const messages: ConsumedMessage[] = [];
    const consumer = this.kafka.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        consumer.disconnect().then(() => {
          reject(new Error(`Timeout waiting for ${expectedCount} messages. Received ${messages.length}`));
        });
      }, timeout);

      consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const value = message.value ? JSON.parse(message.value.toString()) : null;
            messages.push({
              key: message.key?.toString(),
              value,
              headers: message.headers,
              offset: message.offset,
            });

            if (messages.length >= expectedCount) {
              clearTimeout(timer);
              await consumer.disconnect();
              resolve(messages);
            }
          } catch (error) {
            clearTimeout(timer);
            await consumer.disconnect();
            reject(error);
          }
        },
      });
    });
  }

  async getTopicPartitions(topic: string): Promise<number[]> {
    const metadata = await this.admin.fetchTopicMetadata({ topics: [topic] });
    const topicMetadata = metadata.topics.find(t => t.name === topic);

    if (!topicMetadata) {
      throw new Error(`Topic ${topic} not found`);
    }

    return topicMetadata.partitions.map(p => p.partitionId);
  }

  async resetConsumerGroup(groupId: string, topic: string): Promise<void> {
    await this.admin.deleteGroups([groupId]);
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(groupId: string): Consumer | undefined {
    return this.consumers.get(groupId);
  }
}
