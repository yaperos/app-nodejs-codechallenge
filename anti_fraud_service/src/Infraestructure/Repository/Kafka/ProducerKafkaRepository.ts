import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ProducerKafkaInterfaceRepository } from '../../../Domain/Repository/ProducerKafkaRepository';

@Injectable()
export class ProducerKafkaRepository
  implements
    OnModuleInit,
    OnApplicationShutdown,
    ProducerKafkaInterfaceRepository
{
  constructor(private readonly confiService: ConfigService) {}
  private readonly kafka = new Kafka({
    clientId: this.confiService.get<string>('KAFKA_CLIENT_ID'),
    brokers: [this.confiService.get<string>('KAFKA_BROKER')],
  });
  private readonly producer: Producer = this.kafka.producer();
  async onModuleInit() {
    await this.producer.connect();
  }
  async sendMessage(record: ProducerRecord) {
    await this.producer.send(record);
  }
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
