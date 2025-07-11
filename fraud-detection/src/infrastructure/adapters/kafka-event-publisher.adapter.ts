import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPublisher } from '../../domain/interfaces/event-publisher.interface';

@Injectable()
export class KafkaEventPublisher
  implements EventPublisher, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  publish(pattern: string, data: Record<string, unknown>): Promise<void> {
    this.kafkaClient.emit(pattern, JSON.stringify(data));
    return Promise.resolve();
  }
}
