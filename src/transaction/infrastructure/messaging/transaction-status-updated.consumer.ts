import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
} from '../../application/ports/transaction.repository.port.js';
import { KafkaProducerService } from './kafka-producer.service.js';
import { KAFKA_CONFIG } from '../../../common/kafka/kafka.constants.js';
import type { TransactionStatusUpdatedPayload } from '../../domain/messaging/transaction-kafka.messages.js';

@Injectable()
export class TransactionStatusUpdatedConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(TransactionStatusUpdatedConsumer.name);
  private kafka?: Kafka;
  private consumer: Consumer | undefined;

  constructor(
    private readonly config: ConfigService,
    private readonly kafkaProducerConfig: KafkaProducerService,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.config.get<string>(KAFKA_CONFIG.ENABLED) === 'false') {
      this.logger.warn('Status consumer disabled (KAFKA_ENABLED=false)');
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
    const groupId =
      this.config.get<string>(KAFKA_CONFIG.GROUP_STATUS_CONSUMER) ??
      'transaction-api-status';
    this.kafka = new Kafka({
      clientId: `${clientId}-status`,
      brokers,
      retry: { retries: 3, initialRetryTime: 200, maxRetryTime: 2000 },
    });
    this.consumer = this.kafka.consumer({ groupId });
    try {
      await this.consumer.connect();
      const topic = this.kafkaProducerConfig.topicStatusUpdated;
      await this.consumer.subscribe({ topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) {
            return;
          }
          try {
            const body = JSON.parse(
              message.value.toString(),
            ) as TransactionStatusUpdatedPayload;
            if (!body.transactionExternalId || !body.status) {
              return;
            }
            if (body.status !== 'approved' && body.status !== 'rejected') {
              return;
            }
            await this.repository.updateStatusIfPending(
              body.transactionExternalId,
              body.status,
            );
          } catch (e) {
            this.logger.warn(`Invalid status message: ${String(e)}`);
          }
        },
      });
      this.logger.log(`Subscribed to ${topic} for status updates`);
    } catch (e) {
      try {
        await this.consumer.disconnect();
      } catch {
        /* ignore */
      }
      this.consumer = undefined;
      this.logger.error(
        `Kafka status consumer could not start (brokers: ${brokers.join(', ')}). Transactions will stay pending until you run Kafka and restart the API.`,
        e,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
