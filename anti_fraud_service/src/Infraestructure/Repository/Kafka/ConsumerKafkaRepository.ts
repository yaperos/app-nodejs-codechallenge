import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerKafkaInterfaceRepository } from '../../../Domain/Repository/';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerKafkaRepository
  implements OnApplicationShutdown, ConsumerKafkaInterfaceRepository
{
  constructor(private readonly confiService: ConfigService) {}
  private readonly kafka = new Kafka({
    clientId: this.confiService.get<string>('KAFKA_CLIENT_ID'),
    brokers: [this.confiService.get<string>('KAFKA_BROKER')],
  });
  private readonly consumers: Consumer[] = [];
  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: this.confiService.get<string>('KAFKA_GROUP_ID_ANTI_FRAUD'),
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
