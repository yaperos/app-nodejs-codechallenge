import { Consumer, Kafka, Producer } from 'kafkajs';
import { configuration } from '../config';
import logger from '../logger';
import { KafkaTopics } from './kafka.topics';

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = this.getConnection();
    this.producer = this.setProducer();
    this.consumer = this.setConsumer(configuration.kafka.client);
  }

  getConnection(): Kafka {
    return new Kafka({
      clientId: configuration.kafka.client,
      brokers: [configuration.kafka.broker],
      connectionTimeout: 5000,
    });
  }

  setProducer(): Producer {
    return this.kafka.producer();
  }

  setConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }

  public async sendMessage(message: string) {
    await this.producer.connect();

    await this.producer.send({
      topic: KafkaTopics.producer,
      messages: [
        {
          value: message,
        },
      ],
    });
    logger.info(`Message sent to ${KafkaTopics.producer} topic`);
    logger.info(message);

    await this.producer.disconnect();
  }

  public async subscribeConsumerToTopic(): Promise<Consumer> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: KafkaTopics.consumer });
    logger.info(`Consumer subscribed to ${KafkaTopics.consumer} topic`);

    return this.consumer;
  }
}
