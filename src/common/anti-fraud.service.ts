import { EachMessagePayload, ProducerRecord } from "kafkajs";
import { Transaction } from "../transactions/transactions.interface";
import Kafka from './kafka.provider';
import fetchApi from "./fetch.api";

const URL_CALLBACK = process.env.URL_CALLBACK || 'localhost';
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'kafka-topic';

const kafkaClient = Kafka.getClient();
const producer = kafkaClient.producer();

// Method to generate a random response to reject a transaction
const rejected = (max: number): boolean => (Math.floor(Math.random() * max) === 0);

// Fake AntiFraud Service
export const antiFraudService = async(payload: EachMessagePayload): Promise<void> => {
  const { topic, partition, message } = payload;
  const value = message.value?.toString();
  if (value) {
    const { id } = JSON.parse(value);
    const transactionStatus = {
      id,
      // Simulating 33% rejected
      name: rejected(3) ? 'rejected' : 'approved',
    };

    // Returning response to client callback
    try {
      await fetchApi.post(URL_CALLBACK, transactionStatus);
    } catch (e) {
      console.log(e);
    }
  };
};

// Producer to AntiFraud System
export const producerAntiFraud = async(transaction: Transaction) => {
  await producer.connect();
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [{
      value: JSON.stringify(transaction),
    }]
  });
  console.log('Request sent to anti-fraud service');
  await producer.disconnect();
};