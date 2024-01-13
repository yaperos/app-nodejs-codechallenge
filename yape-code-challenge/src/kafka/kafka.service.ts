import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async emit(topic: string, message: object) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribe(topic: string, handler: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        handler(payload);
      },
    });
  }
}
