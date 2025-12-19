import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateTransactionsService } from '../../../../../transaction/service/update-transactions.service';
import { ConfigService } from '@nestjs/config';
import { parseKafkaMessage } from '../../../../../common/messaging/util.kafka';
import { TransactionStatusUpdateSchema } from './transaction-update.schema';
import { Kafka } from 'kafkajs';
import { Logger } from 'nestjs-pino';
import { TransactionStatus } from 'src/transaction/entity/transaction-status.enum';

@Injectable()
export class TransactionUpdateStatusKafkaConsumer implements OnModuleInit {
  private consumerGroupId: string;
  private topicTransactionUpdate: string;

  constructor(
    private readonly updateTransactionsService: UpdateTransactionsService,
    private readonly configService: ConfigService,
    @Inject('KAFKA_CLIENT') private readonly kafka: Kafka,
    private readonly logger: Logger,
  ) {
    this.consumerGroupId =
      this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID') || '';
    this.topicTransactionUpdate =
      this.configService.get<string>('KAFKA_TOPIC_TRANSACTION_UPDATE') || '';
  }
  async onModuleInit() {
    const consumer = this.kafka.consumer({
      groupId: this.consumerGroupId,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: this.topicTransactionUpdate,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        this.logger.debug(
          {
            topic: this.topicTransactionUpdate,
            message: message.value?.toString(),
          },
          'Event received in TransactionUpdateStatusKafkaConsumer',
        );
        if (!message.value) {
          this.logger.warn('Message value is empty');
          return;
        }
        const { transactionId, status } =
          parseKafkaMessage<TransactionStatusUpdateSchema>(message.value);
        await this.updateTransactionsService.updateStatus(
          transactionId,
          status,
        );
      },
    });
  }
}
