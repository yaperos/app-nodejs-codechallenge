import kafkaConfig from './config';
import { Producer } from 'kafkajs';
import { TransactionSchema } from './TransactionSchema';

export class KafkaProducer {
  public static TOPIC_ANTIFRAUD_VALIDATION = 'ANTI-FRAUD_VALIDATION';
  private readonly topic: string;
  private producer: Producer;

  constructor(topic: string) {
    this.topic = topic;
    this.producer = kafkaConfig.producer();
  }

  emit = async (payload: TransactionSchema) => {
    await this.producer.connect();
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(payload) }]
    });
    await this.producer.disconnect();
  };
}
