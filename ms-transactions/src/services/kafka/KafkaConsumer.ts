import kafkaConfig from './config';
import { Consumer } from 'kafkajs';
import { TransactionSchema } from './TransactionSchema';
import { TransactionEntity } from '../../database/entities/TransactionEntity';

export default class KafkaConsumer {
  public static TOPIC_TRANSACTION_REJECTED = 'TRANSACTION_REJECTED';
  public static TOPIC_TRANSACTION_APPROVED = 'TRANSACTION_APPROVED';
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
          switch (topic) {
            case KafkaConsumer.TOPIC_TRANSACTION_APPROVED:
              await TransactionEntity.update(
                {
                  statusId: 2
                },
                {
                  returning: undefined,
                  where: {
                    transactionExternalId: data.transactionExternalId
                  }
                }
              );
              break;
            case KafkaConsumer.TOPIC_TRANSACTION_REJECTED:
              await TransactionEntity.update(
                {
                  statusId: 3
                },
                {
                  returning: undefined,
                  where: {
                    transactionExternalId: data.transactionExternalId
                  }
                }
              );
              break;
          }
        }
      }
    });
  };
}
