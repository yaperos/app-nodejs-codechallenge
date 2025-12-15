import { Kafka } from 'kafkajs';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

export class AntiFraudConsumer {
  private kafka = new Kafka({
    clientId: 'anti-fraud-consumer',
    brokers: ['localhost:9092'],
  });
  private consumer = this.kafka.consumer({ groupId: 'anti-fraud-group' });

  constructor(private readonly repository: TransactionRepository) {}

  async connect() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'transaction.created', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const transaction = JSON.parse(message.value!.toString());
        const newStatus = transaction.value > 1000 ? 'rejected' : 'approved';
        await this.repository.updateStatus(transaction.id, newStatus);
      },
    });
  }
}