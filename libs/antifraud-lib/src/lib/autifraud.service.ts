import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin, Kafka } from 'kafkajs';
import {
  AntifraudRequest,
  AntifraudResponse,
} from '@app-nodejs-codechallenge/core-lib';
import {
  KAFKA_NAME_SERVICE,
  KAFKA_REPLY_TOPIC,
  KAFKA_TOPIC,
} from './constants/kafka.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AntifraudService {
  private admin: Admin | undefined;
  logger = new Logger(AntifraudService.name);
  constructor(
    @Inject(KAFKA_NAME_SERVICE) private client: ClientKafka,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('fibo');
    const kafka = new Kafka({
      clientId: this.configService.get<string>(
        'KAFKA_CLIENT_ID',
        'app-gateway'
      ),
      brokers: ['localhost:9092'],
    });
    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();
    console.log(topics);
    const topicList = [];
    if (!topics.includes(KAFKA_TOPIC)) {
      topicList.push({
        topic: KAFKA_TOPIC,
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes(KAFKA_REPLY_TOPIC)) {
      topicList.push({
        topic: KAFKA_REPLY_TOPIC,
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }
  }

  async validateTransaction(
    transfer: AntifraudRequest
  ): Promise<AntifraudResponse> {
    this.logger.log(`Validate transfer ${JSON.stringify(transfer)}`);
    return new Promise((resolve, reject) => {
      this.client
        .send(KAFKA_TOPIC, {
          key: transfer.key,
          value: JSON.stringify(transfer),
        })
        .subscribe({
          next: (message: AntifraudResponse) => {
            resolve(message);
          },
          error: (err: Error) => {
            this.logger.error('Error verifying transfer', err);
            reject(err);
          },
        });
    });
  }
}
