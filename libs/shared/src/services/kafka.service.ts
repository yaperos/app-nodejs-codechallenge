import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from '../constants/kafka-topics';

@Injectable()
export class KafkaInitService implements OnModuleInit {
  private readonly logger = new Logger(KafkaInitService.name);

  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.createTopics();
  }

  private async createTopics() {
    const topics = Object.values(KAFKA_TOPICS);
    const kafka = (this.kafkaClient as any).client;

    try {
      const admin = kafka.admin();
      await admin.connect();

      const existingTopics = await admin.listTopics();
      const topicsToCreate = topics.filter(
        topic => !existingTopics.includes(topic),
      );

      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate.map(topic => ({
            topic,
            numPartitions: 1,
            replicationFactor: 1,
            configEntries: [
              { name: 'cleanup.policy', value: 'delete' },
              { name: 'retention.ms', value: '86400000' },
            ],
          })),
          waitForLeaders: true,
        });
        this.logger.log(`Created Kafka topics: ${topicsToCreate.join(', ')}`);
      } else {
        this.logger.log('All required topics already exist');
      }

      await admin.disconnect();
    } catch (error) {
      this.logger.error('Error managing Kafka topics:', error);
      throw error;
    }
  }
}
