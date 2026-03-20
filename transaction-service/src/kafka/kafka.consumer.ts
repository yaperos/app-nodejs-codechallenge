import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionsService } from 'src/transactions/service/transactions.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private kakfa = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  private consumer = this.kakfa.consumer({ groupId: 'transaction-group' });

  constructor(private readonly transactionService: TransactionsService) {}

  async onModuleInit() {
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: 'transaction.validated' });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        await this.transactionService.update(data);
      },
    });
  }
}
