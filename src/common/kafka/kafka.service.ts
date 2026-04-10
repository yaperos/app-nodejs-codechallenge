import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'payment-api'),
      brokers: [this.configService.get<string>('KAFKA_BROKER', 'localhost:9092')],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
    await this.producer.disconnect();
    this.logger.log('Kafka clients disconnected');
  }

  async publish(
    topic: string,
    key: string,
    payload: Record<string, unknown>,
    headers?: Record<string, unknown>,
  ): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(payload),
          headers: headers
            ? Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)]))
            : undefined,
        },
      ],
    });
  }

  async subscribe(params: {
    groupId: string;
    topic: string;
    fromBeginning?: boolean;
    eachMessage: (payload: { key?: string; value: Record<string, unknown> }) => Promise<void>;
  }): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: params.groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: params.topic, fromBeginning: params.fromBeginning ?? false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          return;
        }
        const value = JSON.parse(message.value.toString()) as Record<string, unknown>;
        await params.eachMessage({
          key: message.key?.toString(),
          value,
        });
      },
    });
    this.consumers.push(consumer);
    this.logger.log(`Kafka consumer subscribed to ${params.topic} with group ${params.groupId}`);
  }
}
