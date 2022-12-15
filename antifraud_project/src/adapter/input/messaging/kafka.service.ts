
import { Injectable } from '@nestjs/common';
import { Consumer, Kafka, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService {
  private consumer: Consumer;

  constructor() {
    const clientId = 'client-id';
    const groupId = 'group-id';
    const brokers = ['localhost:9092'];
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
  }

  getConsumer() {
    return this.consumer;
  }

  async consume(
    consumer: Consumer,
    topic: string,
    callback: (msg: KafkaMessage) => any,
  ) {
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ message }) => {
        //console.log(`>> TX MessageConsumerController: topic:  ${topic}, received message: ${message.value}`)
        callback(message);
      },
    });
  }
}
