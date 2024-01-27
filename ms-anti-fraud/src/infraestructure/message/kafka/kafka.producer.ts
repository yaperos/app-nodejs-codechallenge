import { Kafka } from "kafkajs";

const producerKafka = new Kafka({
    brokers: ['localhost:9092'],
  });

export const producer = producerKafka.producer();


