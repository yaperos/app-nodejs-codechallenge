import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly logger = new Logger(ConsumerService.name);

  private kafka: Kafka;
  private readonly consumers: Map<string, Consumer> = new Map();

  constructor(private configService: ConfigService) {
    const broker = this.configService.get<string>('kafka.broker');
    const clientId = this.configService.get<string>('kafka.clientId');

    this.kafka = new Kafka({
      clientId: clientId,
      brokers: [broker],
    });
  }

  async consume(
    groupId: string,
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ) {
    const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await cosumer
      .connect()
      .catch((e) => this.logger.error('Failed connecting to Kafka', e.message));
    await cosumer.subscribe(topic);
    await cosumer.run(config);

    this.consumers.set(groupId, cosumer);
  }

  async commitOffset(
    groupId: string,
    topic: string,
    partition: number,
    offset: string,
  ) {
    const consumer = this.consumers.get(groupId);
    if (consumer) {
      await consumer.commitOffsets([
        { topic, partition, offset: (BigInt(offset) + BigInt(1)).toString() },
      ]);
    } else {
      this.logger.error(`No consumer found for group ID: ${groupId}`);
    }
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers.values()) {
      await consumer.disconnect();
    }
  }
}
