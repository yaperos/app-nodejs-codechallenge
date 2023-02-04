import {
  Injectable,
  OnApplicationShutdown,
  // eslint-disable-next-line prettier/prettier
  OnModuleInit
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

Injectable();
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer({
    allowAutoTopicCreation: true,
  });

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
