import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafkaConfig = new Kafka({
  clientId: process.env.CLIENT_ID || 'transactions',
  brokers: [process.env.BROKERS || 'localhost:9092']
});

export default kafkaConfig;
