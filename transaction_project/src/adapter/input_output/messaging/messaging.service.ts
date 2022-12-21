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
    const initialRetryTime = this.configService.get(
      `${kafkaPrefix}.initialRetryTime`,
    );
    const maxRetryTime = this.configService.get(`${kafkaPrefix}.maxRetryTime`);
    const retries = this.configService.get(`${kafkaPrefix}.retries`);

    const kafka = new Kafka({
      clientId,
      brokers,
      retry: { initialRetryTime, maxRetryTime, retries },
    });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer();

    this.antifraudCheckTopic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );
  }

  addTopicConsumer(topic: string, callback: (msg: KafkaMessage) => any) {
    this.topicConsumerMap.set(topic, callback);
  }

  subscribeConsumers() {
    // register every topic and callback
    for (const entry of this.topicConsumerMap.entries()) {
      this.consume(this.consumer, entry[0], entry[1]);
    }
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
