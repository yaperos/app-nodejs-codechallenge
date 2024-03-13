import { Kafka } from "kafkajs"
import { transactionConsumer } from './consumer/transaction.consumer';
import dotenv from 'dotenv';
dotenv.config();

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT,
  brokers: [process.env.KAFKA_BROKER!],
})

transactionConsumer().catch(console.error)
