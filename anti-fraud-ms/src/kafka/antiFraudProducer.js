const { KAFKA_TOPIC_ANTI_FRAUD_RESPONSE } = process.env;

let kafkaProducer;

const importAntiFraudProducer = (producer) => {
  kafkaProducer = producer;
};

const sendAntiFraudResponseProducer = async (id, status) => {
  if (!kafkaProducer) {
    throw new Error('Kafka producer is not available.');
  }

  const message = {
    id,
    status,
  };

  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPIC_ANTI_FRAUD_RESPONSE,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`Sent anti-fraud response message: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error('Error sending anti-fraud response message:', error);
  }
};

module.exports = {
  importAntiFraudProducer,
  sendAntiFraudResponseProducer,
};
