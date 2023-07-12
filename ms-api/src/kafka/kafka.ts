import { Injectable } from '@nestjs/common';
import { Kafka, logLevel, Consumer, Producer } from 'kafkajs';
import { v4 as uuid } from 'uuid';


@Injectable()
export class KafkaService {
  protected consumer: Consumer;
  protected producer: Producer;
  protected handlers: Record<string, any> = {};

  public constructor(
    clientId: string,
    groupId: string,
    brokers: string[],
  ) {
    const kafka = new Kafka({
      clientId,
      brokers,
      logLevel: logLevel.ERROR
    });
    this.consumer = kafka.consumer({ groupId });
    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
    });
  }

  public async init() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: Object.keys(this.handlers), fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        if (this.handlers[topic]) {
          const data = JSON.parse(Buffer.from(message.value).toString());

          await  this.handlers[topic](data);
        }
      },
    });
  }

  public emit(topic: string, message: any) {
    return this.producer.send({
      topic,
      messages: [{
        key: uuid(),
        value: JSON.stringify(message)
      }],
    });
  }

  public subscribe(topic: string, handler) {
    this.handlers[topic] = handler;
  }
}