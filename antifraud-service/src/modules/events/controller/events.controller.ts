import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from 'src/adapters/externalServices/kafka/kafka.consumer.service';
import { MessageTransactionsDto } from 'src/modules/transactions/dto';
import { TransactionsService } from 'src/modules/transactions/services/transactions.service';

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
        topics: [configService.get('KAFKA_TOPIC_TRANSACTION_CREATED')],
      },
      {
        eachMessage: async ({ message }) => {
          const transaction: MessageTransactionsDto = JSON.parse(
            message.value.toString(),
          );

          if (transaction.value > 1000) {
            await this.transactionsService.rejectTransaction(
              transaction.transactionId,
            );
          } else {
            await this.transactionsService.approveTransaction(
              transaction.transactionId,
            );
          }

          Logger.log(
            `Received transaction validate message: ${JSON.stringify(
              transaction,
            )}`,
          );
        },
      },
    );
  }
}
