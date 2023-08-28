const { KAFKA_TOPIC_ANTI_FRAUD_RESPONSE } = process.env;
const { updateTransactionStatusDB } = require('../repositories/transactionRespository');

let kafkaConsumer;

const importTransactionConsumer = (consumer) => {
  kafkaConsumer = consumer;
};

const startTransactionConsumer = async () => {
  if (!kafkaConsumer) {
    throw new Error('Kafka consumer is not available.');
  }

  await kafkaConsumer.subscribe({ topic: KAFKA_TOPIC_ANTI_FRAUD_RESPONSE });

  kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());

      const { id, status } = payload;
      await updateTransactionStatusDB(id, status);
    },
  });

  return kafkaConsumer;
};

module.exports = {
  importTransactionConsumer,
  startTransactionConsumer,
};
