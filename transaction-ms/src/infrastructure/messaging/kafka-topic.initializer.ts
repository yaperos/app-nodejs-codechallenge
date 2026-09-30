import { Inject, Injectable } from '@nestjs/common';
import { dlqTopicFor, Topics } from '@yape/contracts';
import type { Kafka } from 'kafkajs';
import { KAFKA_CLIENT } from '../tokens';

const TOPIC_PARTITIONS = 3;
const TOPIC_REPLICATION_FACTOR = 1;

@Injectable()
export class KafkaTopicInitializer {
  private initialization?: Promise<void>;

  constructor(@Inject(KAFKA_CLIENT) private readonly kafka: Kafka) { }

  ensureTopics(): Promise<void> {
    this.initialization ??= this.createTopics().catch((error: unknown) => {
      this.initialization = undefined;
      throw error;
    });
    return this.initialization;
  }

  private async createTopics(): Promise<void> {
    const admin = this.kafka.admin();
    let connected = false;

    try {
      await admin.connect();
      connected = true;
      const requiredTopics = [
        Topics.TRANSACTION_CREATED,
        Topics.TRANSACTION_STATUS_UPDATED,
      ].map((topic) => ({
        topic,
        numPartitions: TOPIC_PARTITIONS,
        replicationFactor: TOPIC_REPLICATION_FACTOR,
      }));
      const deadLetterTopics = requiredTopics.map(({ topic }) => ({
        topic: dlqTopicFor(topic),
        numPartitions: TOPIC_PARTITIONS,
        replicationFactor: TOPIC_REPLICATION_FACTOR,
      }));
      const existingTopics = new Set(await admin.listTopics());
      const topicsToCreate = [...requiredTopics, ...deadLetterTopics].filter(
        ({ topic }) => !existingTopics.has(topic),
      );

      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate,
          waitForLeaders: true,
        });
      }
    } finally {
      if (connected) await admin.disconnect();
    }
  }
}
