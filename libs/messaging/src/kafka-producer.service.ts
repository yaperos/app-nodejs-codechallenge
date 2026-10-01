import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Partitioners, Producer } from 'kafkajs';
import { KAFKA_OPTIONS, type KafkaOptions } from './kafka.config';

export interface OutgoingMessage {
  key: string;
  value: string | null;
  headers?: Record<string, string>;
}

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly producer: Producer;

  constructor(@Inject(KAFKA_OPTIONS) options: KafkaOptions) {
    this.producer = new Kafka(options).producer({
      idempotent: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }

  async send(topic: string, messages: OutgoingMessage[]): Promise<void> {
    await this.producer.send({
      topic,
      acks: -1,
      messages: messages.map((m) => ({
        key: m.key,
        value: m.value,
        headers: m.headers,
      })),
    });
  }
}
