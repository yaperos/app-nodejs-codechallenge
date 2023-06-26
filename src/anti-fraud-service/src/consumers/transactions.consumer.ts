import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from 'src/services/kafka-consumer.service';
import { KafkaProducerService } from 'src/services/kafka-producer.service';
import { ValidateTransactionService } from 'src/services/validate-transaction.service';
import { ValidatedTransaction } from 'src/types/transaction-validated';
import { ValidateTransaction } from 'src/types/validate-transaction';

@Injectable()
export class ValidateTransactionsConsumer implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly producerService: KafkaProducerService,
    private readonly consumerService: KafkaConsumerService,
    private readonly validateTransactionService: ValidateTransactionService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: this.configService.get('TRANSACTION_VALIDATE_TOPIC').split(','),
      },
      {
        eachMessage: async ({ message, heartbeat }) => {
          await heartbeat();

          const payload: ValidateTransaction = JSON.parse(
            message.value.toString(),
          );

          const response: ValidatedTransaction =
            await this.validateTransactionService.validateTransaction(payload);

          await this.producerService.produce({
            topic: this.configService.get('TRANSACTION_UPDATE_STATUS_TOPIC'),
            messages: [
              {
                key: crypto.randomUUID(),
                value: JSON.stringify(response),
              },
            ],
          });
        },
      },
    );
  }
}
