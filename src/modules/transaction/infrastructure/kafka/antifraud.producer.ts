import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Transaction } from '@prisma/client';

@Injectable()
export class AntifraudProducer implements OnModuleInit {
  private producer!: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: [(process.env.KAFKA_BROKER || 'localhost:9092')],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async emitTransactionCreated(transaction: Transaction) {
    await this.producer.send({
      topic: 'transaction_created',
      messages: [
        {
          key: transaction.id,
          value: JSON.stringify(transaction),
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
