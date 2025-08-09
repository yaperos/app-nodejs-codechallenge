import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async publish<T>(topic: string, key: string, value: T, headers?: Record<string, string>) {
    await lastValueFrom(this.client.emit(topic, { key, value, headers }));
  }
}