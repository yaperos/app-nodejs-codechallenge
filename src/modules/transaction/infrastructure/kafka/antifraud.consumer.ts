import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { UpdateTransactionUseCase } from '@/modules/transaction/application/use-cases/update-transaction.use-case';

@Injectable()
export class AntifraudConsumer implements OnModuleInit {
  constructor(private readonly updateTransactionUseCase: UpdateTransactionUseCase) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'antifraud-consumer',
      brokers: [(process.env.KAFKA_BROKER || 'localhost:9092')],
    });

    const consumer = kafka.consumer({ groupId: 'antifraud-group' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'transaction_created', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (!value) return;
        const REJECT_LIMIT = Number.isNaN(Number(process.env.ANTIFRAUD_REJECT_LIMIT))
        ? 1000
        : Number(process.env.ANTIFRAUD_REJECT_LIMIT);
        
        const data = JSON.parse(value);
        const statusId = data.value > REJECT_LIMIT ? 3 : 2; // 3 = rejected, 2 = approved

        await this.updateTransactionUseCase.execute(data.id, statusId);
      },
    });
  }
}
