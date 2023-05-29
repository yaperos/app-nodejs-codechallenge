import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from 'src/adapters/externalService/kafka/kafka.consumer.service';
import { TransactionUpdateMessageDto } from 'src/modules/transactions/dto';
import { TransactionsService } from 'src/modules/transactions/transactions.service';

const configService = new ConfigService();

@Injectable()
export class EventsController implements OnModuleInit {
  constructor(
    private readonly consumerService: KafkaConsumerService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          configService.get('KAFKA_TOPIC_TRANSACTION_APPROVED'),
          configService.get('KAFKA_TOPIC_TRANSACTION_REJECTED'),
        ],
      },
      {
        eachMessage: async ({ message }) => {
          const transaction: TransactionUpdateMessageDto = JSON.parse(
            message.value.toString(),
          );

          await this.transactionsService.updateTransactionStatus(
            transaction.transactionId,
            transaction.status,
          );

          Logger.log(
            `Received transaction update message: ${JSON.stringify(
              transaction,
            )}`,
          );
        },
      },
    );
  }
}
