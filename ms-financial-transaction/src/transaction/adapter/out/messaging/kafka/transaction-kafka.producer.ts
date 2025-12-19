import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Transaction } from '../../../../../transaction/entity/transaction';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TransactionCreatedSchema } from './transaction-created.schema';
import { publishEvent } from '../../../../../common/messaging/util.kafka';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TransactionKafkaProducer implements OnModuleInit {
  private producer: Producer;
  private topicTransactionCreated: string;

  constructor(
    private configService: ConfigService,
    @Inject('KAFKA_CLIENT') private readonly kafka: Kafka,
    private readonly logger: Logger,
  ) {
    this.topicTransactionCreated =
      this.configService.get<string>('KAFKA_TOPIC_TRANSACTION_CREATED') || '';
  }

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async produceTransactionCreatedEvent(
    transaction: Transaction,
  ): Promise<void> {
    const event: TransactionCreatedSchema = {
      transactionId: transaction.id,
      amount: transaction.amount,
    };

    try {
      await publishEvent(
        this.producer,
        this.topicTransactionCreated,
        event,
        event.transactionId,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.logger.error({ error }, 'Failed to produce Kafka event');
    }
  }
}
