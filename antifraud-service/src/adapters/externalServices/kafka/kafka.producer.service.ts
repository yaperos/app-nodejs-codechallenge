import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    brokers: [configService.get('KAFKA_HOST_URL')],
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
