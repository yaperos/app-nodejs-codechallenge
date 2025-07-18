import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { TransactionService } from '../transactions/transaction.service';
import { ValidationResultDto } from '../transactions/dto/validation-result.dto';
import { kafkaConfig } from '../config/kafka.config';

/**
 * Reactive Kafka Consumer
 */
@Injectable()
export class ReactiveKafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReactiveKafkaConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @Inject(kafkaConfig.KEY)
    private readonly kafkaConfiguration: ConfigType<typeof kafkaConfig>,
    private readonly transactionService: TransactionService,
  ) {
    // Initialize Kafka client
    this.kafka = new Kafka({
      clientId: 'nestjs-consumer',
      brokers: this.kafkaConfiguration.bootstrapServers,
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    // Initialize consumer
    this.consumer = this.kafka.consumer({
      groupId: this.kafkaConfiguration.consumer.groupId,
      allowAutoTopicCreation: true,
    });

    this.logger.log(`🔧 Kafka Consumer configured with brokers: ${this.kafkaConfiguration.bootstrapServers.join(', ')}`);
  }

  async onModuleInit() {
    await this.initialize();
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      this.logger.log('✅ Kafka Consumer disconnected');
    } catch (error) {
      this.logger.error('❌ Error disconnecting Kafka Consumer:', error);
    }
  }

  private async initialize(): Promise<void> {
    try {
      this.logger.log('🔄 Connecting to Kafka Consumer...');
      await this.consumer.connect();

      const topic = this.kafkaConfiguration.consumer.topic;
      this.logger.log(`📡 Subscribing to topic: ${topic}`);

      await this.consumer.subscribe({
        topic: topic,
        fromBeginning: this.kafkaConfiguration.consumer.fromBeginning,
      });

      this.logger.log('✅ Kafka Consumer connected successfully');
      this.startConsuming();
    } catch (error) {
      this.logger.error('❌ Failed to start consuming Kafka messages', error);
      throw error;
    }
  }

  private startConsuming(): void {
    this.consumer.run({
      autoCommit: this.kafkaConfiguration.consumer.autoCommit,
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        try {

          this.processMessage(message);

          const validationResult = this.parseValidationResult(message.value?.toString());

          await this.transactionService.updateTrx(validationResult);

          if (!this.kafkaConfiguration.consumer.autoCommit) {
            await this.consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (parseInt(message.offset) + 1).toString(),
              },
            ]);
          }

          this.logger.log(`✅ Message processed successfully: offset=${message.offset}`);

          await heartbeat();

        } catch (error) {
          this.logger.error('[0] Error processing validation result:', error);

          try {
            this.handleProcessingError(error, message);
          } catch (handlingError) {
            this.logger.error('[1] Error processing validation result:', handlingError);
          }
        }
      },
    });
  }

  private processMessage(message: any): void {
    const key = message.key?.toString();
    const value = message.value?.toString();
    this.logger.log(`� Message received: key = ${key}, value = ${value}`);
  }

  private parseValidationResult(messageValue: string | undefined): ValidationResultDto {
    try {
      if (!messageValue) {
        throw new Error('Message value is empty');
      }

      const data = JSON.parse(messageValue);

      const validationResult = ValidationResultDto.builder()
        .setTransactionId(data.transactionId)
        .setIsFraudulent(data.isFraudulent)
        .setReason(data.reason)
        .build();

      this.logger.log(`📋 Parsed validation result: ${validationResult.transactionId}, fraud: ${validationResult.isFraudulent}`);

      return validationResult;
    } catch (error) {
      this.logger.error('❌ Error parsing validation result:', error);
      throw new Error(`Failed to parse validation result: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private handleProcessingError(error: any, message: any): void {
    this.logger.error(`❌ Failed to process message with offset ${message.offset}:`, error);
    // Here you could implement dead letter queue logic, retry logic, etc.
  }
}