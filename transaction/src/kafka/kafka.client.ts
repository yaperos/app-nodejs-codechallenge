import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';
import { configuration } from '../config/configuration';
import { KafkaTopics } from './topics';

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: configuration.kafka.client,
      brokers: [configuration.kafka.broker],
      connectionTimeout: 3000,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: configuration.kafka.client });
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
    console.log('Message sent to Kafka broker!');

    await this.producer.disconnect();
  }

  public async consumeMessage(transactionService) {
    console.log('Metodo para recibir mensajes del topic: ', KafkaTopics.consumer);
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: KafkaTopics.consumer });

    console.log('antes del consumer run!');

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const value = payload.message.value;
        if (value !== null && value !== undefined) {
          console.log(payload.message.value.toString());
          transactionService.updateTransactionStatus(payload.message.value.toString());
          console.log('transaction updated!');
        }
      },
    });
  }
}
