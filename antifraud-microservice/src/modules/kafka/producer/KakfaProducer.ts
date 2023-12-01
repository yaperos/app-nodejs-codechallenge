import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ConfigurationService } from 'src/modules/config/ConfigurationService';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private configurationService: ConfigurationService) {
    this.kafka = new Kafka({
      brokers: [
        `${this.configurationService.kafkaHost}:${this.configurationService.kafkaPort}`,
      ],
      requestTimeout: Number(this.configurationService.kafkaRequestTimeOut),
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
