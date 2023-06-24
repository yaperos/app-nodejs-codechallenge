import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      brokers: this.config.get('KAFKA_BROKERS').split(','),
    });

    this.producer = this.kafka.producer();
  }
  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
