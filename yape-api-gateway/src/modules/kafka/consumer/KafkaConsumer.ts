import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { ConfigurationService } from 'src/modules/config/ConfigurationService';

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly kafka: Kafka;
  private consumers: Consumer[] = [];
  constructor(private configurationService: ConfigurationService) {
    this.kafka = new Kafka({
      brokers: [
        `${this.configurationService.kafkaHost}:${this.configurationService.kafkaPort}`,
      ],
      requestTimeout: Number(this.configurationService.kafkaRequestTimeOut),
    });
  }

  async consume(
    subscription: ConsumerSubscribeTopics,
    config?: ConsumerRunConfig,
  ): Promise<void> {
    const consumer = this.kafka.consumer({
      groupId: this.configurationService.kafkaGroupId,
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
