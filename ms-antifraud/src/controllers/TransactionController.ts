import { TransactionSchema } from '../services/kafka/TransactionSchema';
import { KafkaProducer } from '../services/kafka/KafkaProducer';

export const validateTransaction = async (transaction: TransactionSchema) => {
  if (transaction.value > 1000) {
    const producer = new KafkaProducer(KafkaProducer.TOPIC_TRANSACTION_REJECTED);
    await producer.emit(transaction);
  } else {
    const producer = new KafkaProducer(KafkaProducer.TOPIC_TRANSACTION_APPROVED);
    await producer.emit(transaction);
  }
};
