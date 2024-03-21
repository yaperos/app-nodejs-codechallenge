import { Injectable } from '@nestjs/common';
import { Client, Producer } from '@nestjs/microservices';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Transaction } from '../transaction/transaction.entity';

@Injectable()
export class KafkaService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'kafka-consumer',
      },
    },
  })
  client: ClientKafka;

  private producer: Producer;

  constructor() {
    const kafkaOptions: KafkaOptions = {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'kafka-consumer',
        },
      },
    };
    this.producer = new Producer(kafkaOptions);
  }

  async sendMessage(topic: string, message: Transaction): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [
        {
          key: 'transaction',
          value: JSON.stringify(message),
        },
      ],
    });
  }
}