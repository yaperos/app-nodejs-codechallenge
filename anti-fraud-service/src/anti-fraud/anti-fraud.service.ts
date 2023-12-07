import { ConsumerService } from 'src/kafka/consumer.service';
import { FraudValidatorService } from './fradu-validator.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer.service';
import { TransactionStatus } from './transaction-status';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(
    private fraudValidatorService: FraudValidatorService,
    private consumerService: ConsumerService,
    private producerService: ProducerService,
  ) {}

  onModuleInit() {
    this.fetchTransactions();
  }

  async fetchTransactions() {
    try {
      await this.consumerService.consume(
        'anti-fraud-service',
        { topics: ['transaction-created'] },
        {
          autoCommit: false,
          eachMessage: async ({ topic, partition, message }) => {
            try {
              await this.processMessage(message);
              await this.commitOffset(
                'anti-fraud-service',
                topic,
                partition,
                message.offset,
              );
            } catch (error) {
              this.logger.error(
                `Error processing message ${message.offset}: ${error.message} `,
              );
              // Handle error appropriately (e.g., retry, log, send to DLQ)
              await this.handleError(topic, partition, message, error);
            }
          },
        },
      );
    } catch (error) {
      this.logger.error(`Failed to start Kafka consumer: ${error.message}`);
      throw error;
    }
  }

  private async processMessage(message: any) {
    try {
      const transaction = JSON.parse(message.value.toString());
      this.logger.log(`Processing transaction: ${transaction.id} `);
      const state = await this.fraudValidatorService.validateFraud();

      if (state === TransactionStatus.APPROVED) {
        await this.produce('transaction-approved', {
          key: transaction.id,
          value: { ...transaction, status: state },
        });
        this.logger.log(`Transaction ${transaction.id} approved`);
      } else {
        await this.produce('transaction-rejected', {
          key: transaction.id,
          value: { ...transaction, status: state },
        });
        this.logger.log(`Transaction ${transaction.id} rejected`);
      }
    } catch (error) {
      this.logger.error(`Error processing Transaction: ${error.message}`);
      throw error;
    }
  }

  private async commitOffset(
    groupId: string,
    topic: string,
    partition: number,
    offset: string,
  ) {
    await this.consumerService.commitOffset(groupId, topic, partition, offset);
  }
  private async handleError(
    topic: string,
    partition: number,
    message: any,
    error: Error,
  ) {
    this.logger.error(`Error handling in process: ${error.message} `);
    // Implement specific error handling strategies, e.g., retry or send to DLQ
  }

  async produce(topic: string, message: any) {
    try {
      await this.producerService.produce(topic, {
        key: message.key,
        value: JSON.stringify(message.value),
      });

      this.logger.log(`Message sent from producer to kafka: ${message.key}`);
    } catch (error) {
      this.logger.error(
        'Failed sending message from producer to Kafka',
        error.message,
      );
    }
  }
}
