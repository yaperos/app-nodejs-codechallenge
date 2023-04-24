import { OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Message, Producer, ProducerBatch, TopicMessages } from 'kafkajs';

interface CustomMessageFormat<T> { data: T }
const server = process.env.SERVER_SNS;
const port = parseInt(process.env.PORT_SNS, 10);
const broker = `${server}:${port}`;
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  
  private readonly kafka = new Kafka({ brokers: [broker] });
  private readonly producer: Producer = this.kafka.producer();
  private readonly produceUpdate: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
    await this.produceUpdate.connect();
  }

  async onApplicationShutdown(signal?: string) {
    await this.producer.disconnect();
    await this.produceUpdate.connect();
  }

  async __producer(message: Array<CustomMessageFormat<any>>) {
    console.log('======= send to anti-fraud ====');
    await this.produceUpdate.sendBatch(this.buildSend(message, 'anti-fraud'));
  }

  async __producerUpdate(message: Array<CustomMessageFormat<any>>) {
    console.log('======= send to update date in bd ====');
    await this.produceUpdate.sendBatch(this.buildSend(message, 'update-data'));
  }

  private buildSend(message: Array<CustomMessageFormat<any>>, topic: string): ProducerBatch {
    const messageToSend: Array<Message> = message.map(mes => {
      return {
        value: JSON.stringify(mes)
      }
    })

    const topics: TopicMessages = {
      topic: topic,
      messages: messageToSend
    }

    return {
      topicMessages: [topics]
    };
  }

}
