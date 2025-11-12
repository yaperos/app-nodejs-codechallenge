import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../../kafka/kafka.service';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from 'src/database/entities/transaction.entity';
import { EachMessagePayload } from 'kafkajs';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private transactionService: TransactionService
  ) { }

  async onModuleInit() {
    await this.kafkaService.subscribeToTopic(
      process.env.KAFKA_TRANSACTION_CREATED_TOPIC || 'transaction.created',
      this.processTransactionCreated.bind(this)
    );
  }

  private async processTransactionCreated(
    payload: EachMessagePayload
  ): Promise<void> {
    try {
      const message: Transaction = JSON.parse(payload.message.value?.toString() ?? '');
      console.log('Transaction processing for anti-fraud:', message);

      const { transactionExternalId, value } = message;

      const status = value <= 1000 ? 'Approved' : 'Rejected';

      await this.transactionService.updateTransactionStatus(
        transactionExternalId,
        status
      );

      await this.kafkaService.sendMessage(
        process.env.KAFKA_TRANSACTION_STATUS_TOPIC || 'transaction.status',
        {
          transactionExternalId,
          status,
          value,
        }
      );
      console.log(`Transaction ${transactionExternalId} ${status} by anti-fraud service`);
    } catch (error) {
      console.error('Error processing anti-fraud:', error);
    }
  }
}
