import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';

@Injectable()
export class MessagingService {
  private consumer: Consumer;
  private producer: Producer;
  private analysisResponseTopic: string;

  constructor(private readonly configService: ConfigService) {
    const kafkaPrefix = 'application.transport.event-driven.kafka';
    const clientId = this.configService.get(`${kafkaPrefix}.client-id`);
    const groupId = this.configService.get(`${kafkaPrefix}.groupd-id`);
    const brokers = [this.configService.get(`${kafkaPrefix}.broker`)];
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer();

    this.analysisResponseTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-analysis-response',
    );
  }

  getConsumer() {
    return this.consumer;
  }

  getProducer() {
    return this.producer;
  }

  notifyTransactionSystem(payload: any) {
    this.send(this.analysisResponseTopic, payload);
  }

  private send(topic: string, payload: any) {
    this.producer.send({
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
