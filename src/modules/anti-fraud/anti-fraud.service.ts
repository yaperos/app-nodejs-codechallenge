import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '../../common/kafka/kafka.service';
import { TransactionService } from '../transaction/transaction.service';
import { EachMessagePayload } from 'kafkajs';
import { Transaction } from '@/database/entities/transaction.entity';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private configService: ConfigService,
    private transactionService: TransactionService
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribeToTopic(
      this.configService.get(
        'KAFKA_TRANSACTION_CREATED_TOPIC',
        'transaction.created'
      ),
      this.processTransactionCreated.bind(this)
    );
  }

  private async processTransactionCreated(
    payload: EachMessagePayload
  ): Promise<void> {
    try {
      const message: Transaction = JSON.parse(payload.message.value.toString());
      console.log('Processing transaction for anti-fraud:', message);

      const { transactionExternalId, value } = message;

      const status = value > 1000 ? 'rejected' : 'approved';

      await this.transactionService.updateTransactionStatus(
        transactionExternalId,
        status
      );

      await this.kafkaService.sendMessage(
        this.configService.get(
          'KAFKA_TRANSACTION_STATUS_TOPIC',
          'transaction.status'
        ),
        {
          transactionExternalId,
          status,
          value,
        }
      );

      console.log(
        `Transaction ${transactionExternalId} ${status} by anti-fraud service`
      );
    } catch (error) {
      console.error('Error processing anti-fraud:', error);
    }
  }
}
