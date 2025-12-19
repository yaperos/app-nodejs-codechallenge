import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EvaluateFraudService } from '../../../../../fraud/service/evaluate-fraud.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TransactionCreatedSchema } from './transaction-created.schema';
import { parseKafkaMessage } from '../../../../../common/messaging/util.kafka';
import { Kafka, KafkaMessage } from 'kafkajs';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TransactionCreatedKafkaConsumer implements OnModuleInit {
  private consumerGroupId: string;
  private topicTransactionCreated: string;

  constructor(
    private readonly evaluateFraudService: EvaluateFraudService,
    private readonly configService: ConfigService,
    @Inject('KAFKA_CLIENT') private readonly kafka: Kafka,
    private readonly logger: Logger,
  ) {
    this.consumerGroupId =
      this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID') || '';
    this.topicTransactionCreated =
      this.configService.get<string>('KAFKA_TOPIC_TRANSACTION_CREATED') || '';
  }

  async onModuleInit() {
    const consumer = this.kafka.consumer({
      groupId: this.consumerGroupId,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: this.topicTransactionCreated,
      fromBeginning: false,
    });
    await consumer.run({
      eachMessage: async ({ message }) => this.handleMessage(message),
    });
  }

  async handleMessage(message: KafkaMessage) {
    this.logger.debug(
      {
        topic: this.topicTransactionCreated,
        message: message.value?.toString(),
      },
      'Message received in TransactionCreatedKafkaConsumer',
    );
    if (!message.value) {
      this.logger.warn('Empty message received');
      return;
    }
    const { transactionId, amount } =
      parseKafkaMessage<TransactionCreatedSchema>(message.value);
    await this.evaluateFraudService.evaluateTransaction(transactionId, amount);
  }
}
