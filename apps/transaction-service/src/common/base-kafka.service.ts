import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export abstract class BaseKafkaService implements OnModuleInit {
  constructor(protected readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    console.log(`${this.constructor.name} initialized and connected to Kafka`);
  }
}
