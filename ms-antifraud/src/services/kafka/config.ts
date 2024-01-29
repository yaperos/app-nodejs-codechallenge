import { Kafka } from 'kafkajs';
// @ts-ignore
import dotenv from 'dotenv';

dotenv.config();

const kafkaConfig = new Kafka({
  clientId: process.env.CLIENT_ID || 'anti-fraud',
  brokers: [process.env.BROKERS || 'localhost:9092']
});

export default kafkaConfig;
