const { statusTypes } = require('../utils/antiFraudConstants');
const { sendAntiFraudResponseProducer } = require('./antiFraudProducer');

const { KAFKA_TOPIC_PROCESS_TRANSACTION } = process.env;

let kafkaConsumer;

const importAntiFraudConsumer = (consumer) => {
  kafkaConsumer = consumer;
};

const startAntiFraudConsumer = async () => {
  if (!kafkaConsumer) {
    throw new Error('Kafka consumer is not available.');
  }

  await kafkaConsumer.subscribe({ topic: KAFKA_TOPIC_PROCESS_TRANSACTION });

  kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());

      const { id, value } = payload;
      await sendAntiFraudResponseProducer(
        id,
        value > 1000 ? statusTypes.REJECTED : statusTypes.APPROVED,
      );
    },
  });

  return kafkaConsumer;
};

module.exports = {
  importAntiFraudConsumer,
  startAntiFraudConsumer,
};
