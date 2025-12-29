import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: [this.configService.get<string>('KAFKA_BROKER', 'localhost:9092')],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: 'transaction-consumer-group',
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async produce(topic: string, message: object) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribe(
    topic: string,
    callback: (payload: EachMessagePayload) => Promise<void>,
  ) {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: callback,
    });
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
