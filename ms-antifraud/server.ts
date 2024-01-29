import KafkaConsumer from './src/services/kafka/KafkaConsumer';

const consumer = new KafkaConsumer('anti-fraud', KafkaConsumer.TOPIC_ANTIFRAUD_VALIDATION);
const init = async () => {
  await consumer.run();
};

init();


