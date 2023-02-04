import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  // eslint-disable-next-line prettier/prettier
  Kafka
} from 'kafkajs';

Injectable();
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly consumers: Consumer[] = [];

  async consume(
    topic: { topic: string; fromBeginning?: boolean },
    config: ConsumerRunConfig,
  ) {
    const consumer = this.kafka.consumer({
      groupId: 'nestjs-kafka',
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
