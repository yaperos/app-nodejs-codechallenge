import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';
import {
  DEFAULT_TOPIC_TRANSACTION_CREATED,
  DEFAULT_TOPIC_TRANSACTION_STATUS_UPDATED,
  KAFKA_CONFIG,
} from '../common/kafka/kafka.constants.js';
import { evaluateFraudDecision } from '../transaction/domain/fraud-rule.js';
import type { TransactionCreatedEventPayload } from '../transaction/domain/messaging/transaction-kafka.messages.js';

@Injectable()
export class AntiFraudService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AntiFraudService.name);
  private kafka: Kafka | undefined;
  private consumer: Consumer | undefined;
  private producer: Producer | undefined;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    if (this.config.get<string>(KAFKA_CONFIG.ENABLED) === 'false') {
      this.logger.warn('Anti-fraud Kafka disabled');
      return;
    }
    const brokers = (
      this.config.get<string>(KAFKA_CONFIG.BROKERS) ?? 'localhost:9092'
    )
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    const clientId =
      this.config.get<string>(KAFKA_CONFIG.CLIENT_ID_ANTI_FRAUD) ??
      'anti-fraud-service';
    const topicCreated =
      this.config.get<string>(KAFKA_CONFIG.TOPIC_CREATED) ??
      DEFAULT_TOPIC_TRANSACTION_CREATED;
    const topicStatus =
      this.config.get<string>(KAFKA_CONFIG.TOPIC_STATUS_UPDATED) ??
      DEFAULT_TOPIC_TRANSACTION_STATUS_UPDATED;
    const groupId =
      this.config.get<string>(KAFKA_CONFIG.GROUP_ANTI_FRAUD) ??
      'anti-fraud-workers';

    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: { retries: 3, initialRetryTime: 200, maxRetryTime: 2000 },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId });
    try {
      await this.producer.connect();
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topicCreated, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) {
            return;
          }
          try {
            const evt = JSON.parse(
              message.value.toString(),
            ) as TransactionCreatedEventPayload;
            if (!evt.transactionExternalId) {
              return;
            }
            const status = evaluateFraudDecision(evt.value);
            const reason =
              status === 'rejected' ? 'AMOUNT_EXCEEDS_1000' : undefined;
            await this.producer!.send({
              topic: topicStatus,
              messages: [
                {
                  key: evt.transactionExternalId,
                  value: JSON.stringify({
                    transactionExternalId: evt.transactionExternalId,
                    status,
                    reason,
                  }),
                },
              ],
            });
          } catch (e) {
            this.logger.warn(`Anti-fraud skip message: ${String(e)}`);
          }
        },
      });
      this.logger.log(
        `Anti-fraud listening on ${topicCreated}, publishing to ${topicStatus}`,
      );
    } catch (e) {
      try {
        await this.consumer?.disconnect();
        await this.producer?.disconnect();
      } catch {
        /* ignore */
      }
      this.consumer = undefined;
      this.producer = undefined;
      this.kafka = undefined;
      this.logger.error(
        `Anti-fraud could not connect to Kafka (brokers: ${brokers.join(', ')}). Start docker compose and run this process again.`,
        e,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer?.disconnect();
    await this.producer?.disconnect();
  }
}
