const { KAFKA_TOPIC_PROCESS_TRANSACTION } = process.env;

let kafkaProducer;

const importTransactionProducer = (producer) => {
  kafkaProducer = producer;
};

const produceEventNewTransaction = async (id, value) => {
  if (!kafkaProducer) {
    throw new Error('Kafka producer is not available.');
  }

  const message = {
    id,
    value,
  };

  try {
    await kafkaProducer.send({
      topic: KAFKA_TOPIC_PROCESS_TRANSACTION,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`Sent new transaction event: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error('Error sending new transaction event:', error);
  }
};

module.exports = {
  importTransactionProducer,
  produceEventNewTransaction,
};
