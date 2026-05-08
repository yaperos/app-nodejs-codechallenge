import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import {
  DEFAULT_TOPIC_TRANSACTION_CREATED,
  DEFAULT_TOPIC_TRANSACTION_STATUS_UPDATED,
  KAFKA_CONFIG,
} from '../../../common/kafka/kafka.constants.js';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private kafka: Kafka | undefined;
  private producer: Producer | undefined;
  private connected = false;
  readonly topicTransactionCreated: string;
  readonly topicStatusUpdated: string;

  constructor(private readonly config: ConfigService) {
    this.topicTransactionCreated =
      this.config.get<string>(KAFKA_CONFIG.TOPIC_CREATED) ??
      DEFAULT_TOPIC_TRANSACTION_CREATED;
    this.topicStatusUpdated =
      this.config.get<string>(KAFKA_CONFIG.TOPIC_STATUS_UPDATED) ??
      DEFAULT_TOPIC_TRANSACTION_STATUS_UPDATED;

    if (!this.isEnabled()) {
      return;
    }

    const brokers = (
      this.config.get<string>(KAFKA_CONFIG.BROKERS) ?? 'localhost:9092'
    )
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    const clientId =
      this.config.get<string>(KAFKA_CONFIG.CLIENT_ID_API) ?? 'transaction-api';
    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: { retries: 3, initialRetryTime: 200, maxRetryTime: 2000 },
    });
    this.producer = this.kafka.producer();
  }

  isEnabled(): boolean {
    return this.config.get<string>(KAFKA_CONFIG.ENABLED) !== 'false';
  }

  canPublish(): boolean {
    return this.isEnabled() && this.connected && !!this.producer;
  }

  async onModuleInit(): Promise<void> {
    if (!this.isEnabled() || !this.producer) {
      this.logger.warn('Kafka producer disabled (KAFKA_ENABLED=false)');
      return;
    }
    try {
      await this.producer.connect();
      this.connected = true;
      this.logger.log('Kafka producer connected');
    } catch (e) {
      this.logger.error(
        `Kafka producer could not connect (brokers: ${this.config.get<string>(KAFKA_CONFIG.BROKERS) ?? 'localhost:9092'}). The API will run; start Docker Kafka or set KAFKA_ENABLED=false. Outbox events will publish when Kafka is available after restart.`,
        e,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connected && this.producer) {
      await this.producer.disconnect();
    }
  }

  async publishJson(topic: string, key: string, value: object): Promise<void> {
    if (!this.isEnabled() || !this.connected || !this.producer) {
      return;
    }
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
        },
      ],
    });
  }
}
