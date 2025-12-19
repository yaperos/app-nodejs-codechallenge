import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TransactionStatusUpdateSchema } from './transaction-update.schema';
import { publishEvent } from '../../../../../common/messaging/util.kafka';
import { TransactionStatus } from '../../../../../fraud/entity/transaction-status.enum';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TransactionUpdateKafkaProducer implements OnModuleInit {
  private producer: Producer;
  private topicTransactionUpdate: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('KAFKA_CLIENT') private readonly kafka: Kafka,
    private readonly logger: Logger,
  ) {
    this.topicTransactionUpdate =
      this.configService.get<string>('KAFKA_TOPIC_TRANSACTION_UPDATE') || '';
  }

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async produceTransactionUpdatedEvent(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<void> {
    const event: TransactionStatusUpdateSchema = {
      transactionId,
      status,
    };
    this.logger.debug(
      {
        topic: this.topicTransactionUpdate,
        event,
      },
      'Producing event to topic',
    );
    try {
      await publishEvent(
        this.producer,
        this.topicTransactionUpdate,
        event,
        transactionId,
      );
    } catch (error) {
      this.logger.error(
        {
          transactionId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error,
        },
        'Failed to publish transaction update event for transaction',
      );
    }
  }
}
