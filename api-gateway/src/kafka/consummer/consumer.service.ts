import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  async onApplicationShutdown() {
    this.consumers.forEach(async (consumer) => await consumer.disconnect());
  }
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly consumers: Consumer[] = [];
  onModuleDestroy() {
    this.consumers.forEach((consumer) => consumer.disconnect());
  }
  onModuleInit() {
    this.consumers.forEach((consumer) => consumer.connect());
  }
  async consumer(
    groupId: string,
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ) {
    const consumer: Consumer = this.kafka.consumer({ groupId });
    await consumer.connect().catch((e) => console.log(e));
    await consumer.subscribe(topic).catch((e) => console.log(e));
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async subscribe(groupId: string, topic: ConsumerSubscribeTopics) {
    const consumer: Consumer = this.kafka.consumer({ groupId });
    await consumer.subscribe(topic);
    return consumer;
  }
}
