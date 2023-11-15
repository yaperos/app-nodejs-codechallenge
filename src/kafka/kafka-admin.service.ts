// kafka-admin.service.ts
import { Injectable } from '@nestjs/common';
import { KafkaClient } from 'kafka-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaAdminService {
  private client: KafkaClient;

  constructor(private readonly configService: ConfigService) {
    const kafkaHost = this.configService.get<string>('KAFKA_HOST');

    this.client = new KafkaClient({ kafkaHost });
  }

  async createTopics(topics: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const topicObjects = topics.map((topic) => ({
        topic,
        partitions: 1,
        replicationFactor: 1,
      }));
      this.client.createTopics(topicObjects, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
