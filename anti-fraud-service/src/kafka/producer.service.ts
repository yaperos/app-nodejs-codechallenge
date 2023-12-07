import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Message, Producer } from 'kafkajs';
import { sleep } from 'src/utils/sleep';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(ProducerService.name);

  private kafka: Kafka;
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeProducer();
    await this.connect();
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('Failed connecting to Kafka', err.message);
      await sleep(5000);
      await this.connect();
    }
  }

  async initializeProducer() {
    const clientId = this.configService.get<string>('kafka.clientId');
    const broker = this.configService.get<string>('kafka.broker');

    this.kafka = new Kafka({
      clientId: clientId,
      brokers: [broker],
    });

    this.producer = this.kafka.producer({
      idempotent: true,
    });
  }

  async produce(topic: string, message: Message) {
    return await this.producer.send({
      topic: topic,
      messages: [message],
    });
  }

  async onApplicationShutdown() {
    this.logger.log('Disconnecting from Kafka');
    await this.producer.disconnect();
  }
}
