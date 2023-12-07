import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { TransactionService } from './transaction.service';

@Injectable()
export class TransactionEventsService implements OnModuleInit {
  private readonly logger = new Logger(TransactionEventsService.name);

  constructor(
    private consumerService: ConsumerService,
    private producerService: ProducerService,
    private transactionService: TransactionService,
  ) {}

  async onModuleInit() {
    await this.fetchTransactionsUpadtes();
  }

  async fetchTransactionsUpadtes() {
    await this.consumerService.consume(
      'transaction-api-command',
      {
        topics: ['transaction-rejected', 'transaction-approved'],
        fromBeginning: true,
      },
      {
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const messageValue = JSON.parse(message.value.toString());
            const isUpdated = await this.updateTransactionStatus(messageValue);
            if (isUpdated) {
              await this.publishTransactionStatus(messageValue);
            }
            await this.consumerService.commitOffset(
              'transaction-api-command',
              topic,
              partition,
              message.offset,
            );
          } catch (error) {
            // Handle error appropriately (e.g., retry, log, send to DLQ)
            this.logger.error('Error processing message:');
          }
        },
      },
    );
  }
  async updateTransactionStatus(message) {
    const { id, status } = message;
    const isUpdated = await this.transactionService.updateTransactionStatus(
      id,
      status,
    );
    return isUpdated;
  }
  async publishTransactionStatus(message) {
    const { id, status } = message;
    await this.producerService.produce('transaction-status-updated', {
      key: id,
      value: JSON.stringify({ id, status }),
    });
    this.logger.log(`published transaction-status-updated: ${id} `);
  }
}
