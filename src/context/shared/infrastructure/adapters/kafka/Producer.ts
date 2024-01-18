import { Kafka, Producer as KafkaProducer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'yape_client',
  brokers: ['localhost:9092'],
});

export const produceMessage = async (topic: string, value: object) => {
  const producer: KafkaProducer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(value),
      },
    ],
  });
  await producer.disconnect();
};
