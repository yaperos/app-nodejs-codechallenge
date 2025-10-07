import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { TransactionService } from '../../transaction/transaction.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly transactionService: TransactionService,
  ) {}

  async onModuleInit() {
    const consumer = this.kafkaService.getConsumer();

    await consumer.subscribe({ topic: 'transactions', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const transaction = JSON.parse(message.value?.toString() || '{}');

        const status = transaction.value > 1000 ? 'rechazado' : 'aprobado';

        await this.transactionService.updateTransactionStatus(
          transaction.transactionExternalId,
          status,
        );
      },
    });
  }
}
