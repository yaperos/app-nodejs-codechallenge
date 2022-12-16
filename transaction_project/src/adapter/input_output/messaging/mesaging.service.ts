import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';

@Injectable()
export class MessagingService {
  private consumer: Consumer;
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {
    const kafkaPrefix = 'application.transport.event-driven.kafka';
    const clientId = this.configService.get(`${kafkaPrefix}.client-id`);
    const groupId = this.configService.get(`${kafkaPrefix}.groupd-id`);
    const brokers = [this.configService.get(`${kafkaPrefix}.broker`)];
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer();
  }

  getConsumer() {
    return this.consumer;
  }

  getProducer() {
    return this.producer;
  }

  async sendToAntifraud(payload: any) {
    const topic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  }

  private async send(producer: Producer, topic: string, payload: any) {
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
