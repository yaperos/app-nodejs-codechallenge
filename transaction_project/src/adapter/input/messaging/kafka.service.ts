import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;

  constructor() {
    const clientId = 'client-id-transaction';
    const brokers = ['localhost:9092'];
    const kafka = new Kafka({ clientId, brokers });
    this.producer = kafka.producer();
  }

  getProducer() {
    return this.producer;
  }

  async send(producer: Producer, topic: string, payload: any) {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}