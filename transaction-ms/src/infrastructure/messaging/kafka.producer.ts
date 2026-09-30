import {
  Inject,
  Injectable,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';
import type { Kafka, Message, Producer } from 'kafkajs';
import { KAFKA_CLIENT } from '../tokens';
import { KafkaTopicInitializer } from './kafka-topic.initializer';


export interface OutgoingMessage {
  topic: string;
  key: string;
  value: string;
  headers?: Record<string, string>;
}

@Injectable()
export class KafkaProducer implements OnModuleInit, OnApplicationShutdown {
  private readonly producer: Producer;

  constructor(
    @Inject(KAFKA_CLIENT) kafka: Kafka,
    private readonly topicInitializer: KafkaTopicInitializer,
  ) {
    this.producer = kafka.producer({
      idempotent: true,
      maxInFlightRequests: 1,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.topicInitializer.ensureTopics();
    await this.producer.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  send(message: OutgoingMessage): Promise<void> {
    return this.sendMany([message]);
  }

  async sendMany(messages: OutgoingMessage[]): Promise<void> {
    const byTopic = new Map<string, Message[]>();
    for (const m of messages) {
      const list = byTopic.get(m.topic) ?? [];
      list.push({ key: m.key, value: m.value, headers: m.headers });
      byTopic.set(m.topic, list);
    }
    await this.producer.sendBatch({
      acks: -1,
      topicMessages: [...byTopic].map(([topic, msgs]) => ({
        topic,
        messages: msgs,
      })),
    });
  }
}
