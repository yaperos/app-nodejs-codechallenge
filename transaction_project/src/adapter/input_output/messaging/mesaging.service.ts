import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';

@Injectable()
export class MessagingService {
  private consumer: Consumer;
  private producer: Producer;
  private antifraudCheckTopic: string;

  private topicConsumerMap = new Map();

  constructor(private readonly configService: ConfigService) {
    const kafkaPrefix = 'application.transport.event-driven.kafka';
    const clientId = this.configService.get(`${kafkaPrefix}.client-id`);
    const groupId = this.configService.get(`${kafkaPrefix}.groupd-id`);
    const brokers = [this.configService.get(`${kafkaPrefix}.broker`)];
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer();

    this.antifraudCheckTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );

    // register every topic and callback
    this.topicConsumerMap.forEach((topic, callback) => {
      this.consume(this.consumer, topic, callback);
    });
  }

  addTopicConsumer(topic: string, callback: (msg: KafkaMessage) => any) {
    this.topicConsumerMap[topic] = callback;
  }

  getConsumer() {
    return this.consumer;
  }

  getProducer() {
    return this.producer;
  }

  notifyAntifraudSystem(payload: any) {
    this.send(this.antifraudCheckTopic, payload);
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
