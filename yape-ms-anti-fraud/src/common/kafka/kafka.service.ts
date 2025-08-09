import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* Extra */
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly consumerGroup: string;

  private readonly listeners: Map<
    string,
    (payload: EachMessagePayload) => Promise<void>
  > = new Map();

  constructor(configService: ConfigService) {
    this.kafka = new Kafka({
      brokers: [configService.get('KAFKA_URL')!],
      retry: {
        retries: 5,
        factor: 3,
      },
    });

    this.consumerGroup = configService.get(
      'KAFKA_TRANSACTIONS_CONSUMER_GROUP',
    )!;

    this.producer = this.kafka.producer();
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.consumerGroup });
  }

  async onModuleInit() {
    await Promise.all([this.producer.connect(), this.consumer.connect()]);
  }

  async onApplicationBootstrap() {
    console.log({
      listener: this.listeners,
    });

    for (const [topic] of this.listeners) {
      this.logger.log(`Subscribing to topic: ${topic}`);
      await this.consumer.subscribe({ topic, fromBeginning: true });
    }

    await this.consumer.run({
      eachMessage: async (payload) => {
        const handler = this.listeners.get(payload.topic);

        if (handler) {
          await handler(payload);
        } else {
          this.logger.warn(`No handler registered for topic: ${payload.topic}`);
        }
      },
    });
  }

  registerListener(
    topic: string,
    callback: (payload: EachMessagePayload) => Promise<void>,
  ) {
    if (this.listeners.has(topic)) {
      throw new Error(`Listener for topic "${topic}" already registered`);
    }

    this.listeners.set(topic, callback);
  }

  async publishToTopic(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: message,
        },
      ],
    });
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Application is shutting down by signal ${signal}...`);
    await Promise.all([this.producer.disconnect(), this.consumer.disconnect()]);
  }
}
