import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Kafka } from 'kafkajs';
import { AdminKafkaInterfaceRepository } from '../../../Domain/Repository/';

@Injectable()
export class AdminKafkaRepository
  implements OnApplicationShutdown, OnModuleInit, AdminKafkaInterfaceRepository
{
  constructor(private readonly confiService: ConfigService) {}

  private readonly kafka = new Kafka({
    clientId: this.confiService.get<string>('KAFKA_CLIENT_ID'),
    brokers: [this.confiService.get<string>('KAFKA_BROKER')],
  });
  private readonly admin: Admin = this.kafka.admin();
  async onModuleInit() {
    await this.admin.connect();
  }
  async createTopic() {
    await this.admin.createTopics({
      topics: [
        {
          topic: this.confiService.get<string>('KAFKA_TOPIC'),
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
  }
  async onApplicationShutdown(signal?: string) {
    await this.admin.disconnect();
  }
}
