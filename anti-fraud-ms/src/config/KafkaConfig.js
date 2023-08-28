const { Kafka } = require('kafkajs');
const { importAntiFraudProducer } = require('../kafka/antiFraudProducer');
const { importAntiFraudConsumer, startAntiFraudConsumer } = require('../kafka/antiFraudConsumer');

const { KAFKA_CONSUMER_CLIENT_ID, KAFKA_CONSUMER_GROUP_ID, KAFKA_BROKER } = process.env;

const kafka = new Kafka({
  brokers: [KAFKA_BROKER],
  clientId: KAFKA_CONSUMER_CLIENT_ID,
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: KAFKA_CONSUMER_GROUP_ID,
  fetchMaxWaitMs: 100,
  maxWaitTimeInMs: 100,
});

const initializeKafka = async () => {
  try {
    await Promise.all([
      producer.connect(),
      consumer.connect(),
    ]);

    importAntiFraudProducer(producer);
    importAntiFraudConsumer(consumer);

    await startAntiFraudConsumer();
  } catch (error) {
    console.error('Error initializing kafka for anti-fraud-ms:', error);
  }
};

module.exports = { initializeKafka };
