import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka: Kafka;
  private readonly consumers: Map<string, Consumer> = new Map();
  private readonly consumerTopics: Map<string, string[]> = new Map();

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(',');
    const clientId = this.configService.get('KAFKA_CLIENT_ID', 'yape-transaction-service');

    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      requestTimeout: 30000,
    });
  }

  async createConsumer(groupId: string, topics: string[]): Promise<void> {
    const consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576,
    });

    await consumer.connect();
    await consumer.subscribe({
      topics,
      fromBeginning: false
    });

    this.consumers.set(groupId, consumer);
    this.consumerTopics.set(groupId, topics);
    this.logger.log(`Consumer ${groupId} created for topics: ${topics.join(', ')}`);
  }

  async startConsumer(
    groupId: string,
    messageHandler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (!consumer) {
      throw new Error(`Consumer ${groupId} not found`);
    }

    await consumer.run({
      autoCommit: false,
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;

        try {
          this.logger.debug(
            `Processing message from ${topic}:${partition} offset ${message.offset}`
          );

          await messageHandler(payload);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            },
          ]);

          this.logger.debug(
            `Successfully processed message from ${topic}:${partition} offset ${message.offset}`
          );
        } catch (error) {
          this.logger.error(
            `Failed to process message from ${topic}:${partition} offset ${message.offset}`,
            error,
          );

          await this.handleFailedMessage(payload, error);
        }
      },
    });

    this.logger.log(`Consumer ${groupId} started`);
  }

  async pauseConsumer(groupId: string, topics?: string[]): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (!consumer) {
      throw new Error(`Consumer ${groupId} not found`);
    }

    if (topics) {
      const topicPartitions = topics.map(topic => ({ topic }));
      await consumer.pause(topicPartitions);
      this.logger.log(`Paused consumer ${groupId} for topics: ${topics.join(', ')}`);
    } else {
      const subscribedTopics = this.consumerTopics.get(groupId) || [];
      const topicPartitions = subscribedTopics.map(topic => ({ topic }));
      await consumer.pause(topicPartitions);
      this.logger.log(`Paused consumer ${groupId} for all topics`);
    }
  }

  async resumeConsumer(groupId: string, topics?: string[]): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (!consumer) {
      throw new Error(`Consumer ${groupId} not found`);
    }

    if (topics) {
      const topicPartitions = topics.map(topic => ({ topic }));
      await consumer.resume(topicPartitions);
      this.logger.log(`Resumed consumer ${groupId} for topics: ${topics.join(', ')}`);
    } else {
      const subscribedTopics = this.consumerTopics.get(groupId) || [];
      const topicPartitions = subscribedTopics.map(topic => ({ topic }));
      await consumer.resume(topicPartitions);
      this.logger.log(`Resumed consumer ${groupId} for all topics`);
    }
  }

  async seekToBeginning(groupId: string, topics: string[]): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (!consumer) {
      throw new Error(`Consumer ${groupId} not found`);
    }

    await consumer.seek({
      topic: topics[0],
      partition: 0,
      offset: '0'
    });

    this.logger.log(`Consumer ${groupId} seeked to beginning for topics: ${topics.join(', ')}`);
  }

  private async handleFailedMessage(
    payload: EachMessagePayload,
    error: Error,
  ): Promise<void> {
    const { topic, partition, message } = payload;

    const retryCount = parseInt(
      message.headers?.['retry-count']?.toString() || '0',
      10,
    );

    const maxRetries = 3;

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;

      this.logger.warn(
        `Retrying message from ${topic}:${partition} offset ${message.offset} ` +
        `(attempt ${retryCount + 1}/${maxRetries}) after ${delay}ms`
      );

      setTimeout(() => {
        this.logger.debug(`Would retry message ${message.offset} now`);
      }, delay);
    } else {
      this.logger.error(
        `Message from ${topic}:${partition} offset ${message.offset} ` +
        `exceeded max retries. Sending to DLQ`,
      );

      this.sendToDLQ(payload, error);
    }
  }

  private sendToDLQ(payload: EachMessagePayload, error: Error): void {
    this.logger.error(
      `Message sent to DLQ: ${JSON.stringify({
        originalTopic: payload.topic,
        partition: payload.partition,
        offset: payload.message.offset,
        error: error.message,
        timestamp: new Date().toISOString(),
      })}`
    );
  }

  async onModuleDestroy() {
    for (const [groupId, consumer] of this.consumers) {
      try {
        await consumer.disconnect();
        this.logger.log(`Consumer ${groupId} disconnected`);
      } catch (error) {
        this.logger.error(`Failed to disconnect consumer ${groupId}`, error);
      }
    }
  }
}