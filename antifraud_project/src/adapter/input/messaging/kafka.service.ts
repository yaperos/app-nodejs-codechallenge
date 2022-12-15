
import { Injectable } from '@nestjs/common';
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private consumer: Consumer;
  private producer: Producer;

  constructor() {
    const clientId = 'client-id';
    const groupId = 'group-id';
    const brokers = ['localhost:9092'];
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer()
  }

  getConsumer() {
    return this.consumer;
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
