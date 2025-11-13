import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Admin } from 'kafkajs';
import { KafkaFactory } from './kafka.factory';
import {
  TRANSACTIONS_CREATED_TOPIC,
  TRANSACTIONS_STATUS_CHANGED_TOPIC,
} from './constants';

@Injectable()
export class KafkaSetupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaSetupService.name);
  private admin: Admin | null = null;

  constructor(private readonly kafkaFactory: KafkaFactory) {}

  async onModuleInit(): Promise<void> {
    this.admin = this.kafkaFactory.createAdmin();
    await this.admin.connect();
    const topics = [TRANSACTIONS_CREATED_TOPIC, TRANSACTIONS_STATUS_CHANGED_TOPIC];

    const existingTopics = await this.admin.listTopics();
    const missingTopics = topics.filter((topic) => !existingTopics.includes(topic));

    if (missingTopics.length > 0) {
      await this.admin.createTopics({
        topics: missingTopics.map((topic) => ({ topic })),
        waitForLeaders: true,
      });
      this.logger.log(`Created Kafka topics: ${missingTopics.join(', ')}`);
    } else {
      this.logger.debug('Kafka topics already exist, skipping creation');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.admin) {
      await this.admin.disconnect();
      this.admin = null;
    }
  }
}
