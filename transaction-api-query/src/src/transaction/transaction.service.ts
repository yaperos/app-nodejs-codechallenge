import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { DataBaseService } from '../database/database.service';
import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private databaseService: DataBaseService,
    private consumerService: ConsumerService,
  ) {}

  onModuleInit() {
    this.fetchTransactions();
  }

  async getById(id: string) {
    try {
      const transaction = await this.databaseService.getById(id);
      this.logger.log(`Transaction retrieved: ${transaction.id}`);
      return transaction;
    } catch (error) {
      this.logger.error(`Error retrieving transaction: ${error.message}`);
      throw error;
    }
  }

  async fetchTransactions() {
    try {
      await this.consumerService.consume(
        'transaction-api-query',
        {
          topics: ['transaction-created', 'transaction-status-updated'],
          fromBeginning: true,
        },
        {
          autoCommit: false,
          eachMessage: async ({ topic, partition, message }) => {
            try {
              if (topic === 'transaction-status-updated') {
                await this.updateTransactionStatus(
                  JSON.parse(message.value.toString()),
                );
              } else {
                const messageKey = message.key.toString();
                const isMessageProcessed = await this.isMessageProcessed(
                  messageKey,
                );
                if (!isMessageProcessed) {
                  await this.processMessage(message);
                }
              }
              await this.commitOffset(
                'transaction-api-query',
                topic,
                partition,
                message.offset,
              );
            } catch (error) {
              this.logger.error(
                `Error saving transaction ${message.offset}: ${error.message} `,
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

  private async isMessageProcessed(messageId: string): Promise<boolean> {
    try {
      const transaction = await this.databaseService.getById(messageId);
      return !!transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }

  private async processMessage(message: any) {
    try {
      const transaction = JSON.parse(message.value.toString());
      this.logger.log(`Processing transaction: ${transaction.id} `);
      await this.databaseService.create(transaction);
      this.logger.log(`Transaction saved: ${transaction.id} `);
    } catch (error) {
      this.logger.error(`Error saving transaction: ${error.message} `);
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

  async updateTransactionStatus(message) {
    const { id, status } = message;
    this.logger.log(`Updating transaction status: ${id} `);
    await this.databaseService.updateTransactionStatus(id, status);
  }
}
