import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';

interface Transaction {
  id: string;
  value: string;
}

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: ['transaction-created'],
      },
      {
        eachMessage: async ({ topic, message }) => {
          const { value } = message;
          const transaction = JSON.parse(value.toString()) as Transaction;

          console.log('TRANSACTION', transaction);

          if (Number.parseFloat(transaction.value) > 1000) {
            await this.producerService.produce({
              topic: 'transaction-rejected',
              messages: [
                {
                  value: transaction.id,
                },
              ],
            });
          } else {
            await this.producerService.produce({
              topic: 'transaction-approved',
              messages: [
                {
                  value: transaction.id,
                },
              ],
            });
          }
        },
      },
    );
  }
}
