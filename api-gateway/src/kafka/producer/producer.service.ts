import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  onApplicationShutdown() {
    this.producer.disconnect();
  }
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();
  onModuleDestroy() {
    this.producer.disconnect();
  }
  onModuleInit() {
    this.producer.connect();
  }
  async produce(record: ProducerRecord) {
    this.producer.send(record);
  }
}
