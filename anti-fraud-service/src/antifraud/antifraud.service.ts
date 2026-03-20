import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Kafka } from 'kafkajs';

@Injectable()
export class AntiFraudService {
  private kakfa = new Kafka({
    clientId: 'anti-fraud-service',
    brokers: ['localhost:9092'],
  });

  private producer = this.kakfa.producer();

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async handleTransaction(data: any) {
    const key = `processed:${data.transactionId}`;

    // verify idempotence
    const existing = await this.redis.get(key);
    if (existing) {
      console.log('Transaction already processed: ', data.transactionId);
    }

    // mark processed
    await this.redis.set(key, '1', 'EX', 3600);

    // logic antifraude
    const status = data.value > 1000 ? 'rejected' : 'approved';
    console.log(`Transaction ${data.transactionId}: ${status}`);

    await this.producer.connect();

    // Send result
    await this.producer.send({
      topic: 'transaction.validated',
      messages: [
        {
          value: JSON.stringify({
            transactionId: data.transactionId,
            status,
          }),
        },
      ],
    });
  }
}
