import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'yape-code-challenge',
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });
    this.producer = this.kafka.producer();
  }

  createConsumer(groupId: string): Consumer {
    const consumer = this.kafka.consumer({ groupId });
    this.logger.log(`Consumer created (groupId=${groupId})`);
    return consumer;
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async emit(topic: KAFKA_TOPICS, message: object) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    this.logger.log(
      `Message (${JSON.stringify(message)}) sent to topic: ${topic} succesfully.`,
    );
  }

  async subscribe(
    consumer: Consumer,
    topic: string,
    handler: (message: any) => void,
  ) {
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        handler(payload);
      },
    });
    this.logger.log(`Subscribed to topic: ${topic} succesfully.`);
  }
}
