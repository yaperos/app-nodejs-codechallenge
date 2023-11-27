import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      brokers: [
        `${this.configService.get('KAFKA_HOST')}:${this.configService.get(
          'KAFKA_PORT',
        )}`,
      ],
    });
  }

  async consume(
    subscription: ConsumerSubscribeTopics,
    config?: ConsumerRunConfig,
  ): Promise<void> {
    const consumer = this.kafka.consumer({
      groupId: this.configService.get('KAFKA_GROUP_ID'),
    });
    await consumer.connect();
    await consumer.subscribe(subscription);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onModuleDestroy() {
    for (const consumer in this.consumers) {
      await this.consumers[consumer].disconnect();
    }
  }
}
