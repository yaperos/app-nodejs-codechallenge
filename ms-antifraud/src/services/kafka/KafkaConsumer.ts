import kafkaConfig from './config';
import { Consumer } from 'kafkajs';
import { TransactionSchema } from './TransactionSchema';
import { validateTransaction } from '../../controllers/TransactionController';

export default class KafkaConsumer {
  public static TOPIC_ANTIFRAUD_VALIDATION = 'ANTI-FRAUD_VALIDATION';
  private consumer: Consumer;
  private readonly topic: string = '';

  constructor(consumerGroupId: string, topicId: string) {
    this.consumer = kafkaConfig.consumer({ groupId: consumerGroupId });
    this.topic = topicId;
  }

  run = async () => {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {

        if (message.value) {
          const data: TransactionSchema = JSON.parse(message.value.toString());
          if (topic == KafkaConsumer.TOPIC_ANTIFRAUD_VALIDATION) {
            await validateTransaction(data);
          }
        }
      }
    });
  };
}
