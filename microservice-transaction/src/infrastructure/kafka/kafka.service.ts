import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  constructor(private readonly environment: EnvironmentConfigService) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [`${this.environment.getKafkaHost()}:${this.environment.getKafkaPort()}`],
    });
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
  }

  async consumeMessages(topic: string): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'my-group' });
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {},
    });
  }
}
