import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export interface KafkaTopicMetadata {
  topics: string[];
  brokers: string[];
}

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly transactionTopic: string;
  private readonly eventsTopic: string;
  private readonly dlqTopic: string;

  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.transactionTopic = this.configService.get('KAFKA_TRANSACTION_TOPIC', 'yape.transactions');
    this.eventsTopic = this.configService.get('KAFKA_EVENTS_TOPIC', 'yape.events');
    this.dlqTopic = this.configService.get('KAFKA_DLQ_TOPIC', 'yape.transactions.dlq');
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer connected');
  }

  async publishTransaction(transactionId: string, data: unknown): Promise<void> {
    try {
      const message = {
        key: transactionId,
        value: JSON.stringify({
          ...(data as Record<string, unknown>),
          timestamp: new Date().toISOString(),
        }),
        headers: {
          'correlation-id': transactionId,
          'event-type': 'transaction',
        },
      };

      await lastValueFrom(
        this.kafkaClient.emit(this.transactionTopic, message)
      );

      this.logger.debug(`Published transaction ${transactionId} to ${this.transactionTopic}`);
    } catch (error) {
      this.logger.error(`Failed to publish transaction ${transactionId}`, error);
      await this.publishToDLQ(transactionId, data, error.message);
      throw error;
    }
  }

  async publishEvent(eventType: string, eventData: unknown): Promise<void> {
    try {
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const message = {
        key: eventId,
        value: JSON.stringify({
          eventId,
          eventType,
          data: eventData,
          timestamp: new Date().toISOString(),
        }),
        headers: {
          'event-type': eventType,
          'event-id': eventId,
        },
      };

      await lastValueFrom(
        this.kafkaClient.emit(this.eventsTopic, message)
      );

      this.logger.debug(`Published event ${eventType} to ${this.eventsTopic}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${eventType}`, error);
      throw error;
    }
  }

  async publishBatch(messages: Array<{ key: string; value: unknown }>): Promise<void> {
    try {
      const kafkaMessages = messages.map(msg => ({
        key: msg.key,
        value: JSON.stringify(msg.value),
        headers: {
          'batch-id': `batch-${Date.now()}`,
          'batch-size': messages.length.toString(),
        },
      }));

      for (const message of kafkaMessages) {
        await lastValueFrom(
          this.kafkaClient.emit(this.transactionTopic, message)
        );
      }

      this.logger.debug(`Published batch of ${messages.length} messages`);
    } catch (error) {
      this.logger.error('Failed to publish batch', error);
      throw error;
    }
  }

  private async publishToDLQ(id: string, data: unknown, error: string): Promise<void> {
    try {
      const dataAsRecord = data as Record<string, unknown>;
      const dlqMessage = {
        key: id,
        value: JSON.stringify({
          originalData: data,
          error,
          failedAt: new Date().toISOString(),
          retryCount: (typeof dataAsRecord?.retryCount === 'number' ? dataAsRecord.retryCount : 0),
        }),
        headers: {
          'original-topic': this.transactionTopic,
          'error-type': 'publish-failure',
        },
      };

      await lastValueFrom(
        this.kafkaClient.emit(this.dlqTopic, dlqMessage)
      );

      this.logger.warn(`Message ${id} sent to DLQ: ${error}`);
    } catch (dlqError) {
      this.logger.error(`Failed to send message ${id} to DLQ`, dlqError);
    }
  }

  async getTopicMetadata(): Promise<KafkaTopicMetadata> {
    return {
      topics: [this.transactionTopic, this.eventsTopic, this.dlqTopic],
      brokers: this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
    };
  }
}