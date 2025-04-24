import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Transaction } from '@prisma/client';

/**
 * Kafka producer responsible for emitting events when a transaction is created.
 *
 * This service connects to a Kafka broker and sends messages to the `transaction_created` topic,
 * which are later consumed by the antifraud microservice.
 */
@Injectable()
export class AntifraudProducer implements OnModuleInit {
  private producer!: Producer;

  /**
   * Initializes the Kafka producer when the module is loaded.
   * Connects to the broker using the environment variable or defaults to localhost.
   */
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: [(process.env.KAFKA_BROKER || 'localhost:9092')],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  /**
   * Emits a message to the `transaction_created` Kafka topic.
   *
   * This message contains the serialized transaction object and can be used
   * for downstream processing like antifraud validation.
   *
   * @param transaction - The transaction to be emitted.
   */
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

  /**
   * Gracefully disconnects the Kafka producer when the application shuts down.
   */
  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
