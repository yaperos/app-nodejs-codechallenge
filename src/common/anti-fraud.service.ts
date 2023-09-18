import { EachMessagePayload, ProducerRecord } from "kafkajs";
import { BaseTransaction } from "../transactions/transactions.interface";
import Kafka from './kafka.provider';

const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'kafka-topic';

const kafkaClient = Kafka.getClient();
const producer = kafkaClient.producer();

// Fake AntiFraud System
export const antiFraudService = async(payload: EachMessagePayload): Promise<void> => {
  const { topic, partition, message } = payload;
  const value = message.value?.toString();
  if (value) {
    const petition = JSON.parse(value);
    console.log({ petition });
  };
};

// Producer to AntiFraud System
export const producerAntiFraud = async(transaction: BaseTransaction) => {
  await producer.connect();
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [{
      value: JSON.stringify(transaction),
    }]
  });
  console.log('Request sending to anti-fraud service');
  await producer.disconnect();
}