import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AntiFraudService } from 'src/antifraud/antifraud.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private kakfa = new Kafka({
    clientId: 'anti-fraud-service',
    brokers: ['localhost:9092'],
  });

  private consumer = this.kakfa.consumer({ groupId: 'anti-fraud-group' });

  constructor(private readonly antiFraudeService: AntiFraudService) {}

  async onModuleInit() {
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: 'transaction.created' });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log('Antifraud to transaction: ', data.transactionId);
        await this.antiFraudeService.handleTransaction(data);
      },
    });
  }
}
