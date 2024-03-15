import 'dotenv/config'
import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: process.env.APP_NAME,
  brokers: ['localhost:9092'],
  connectionTimeout: 3000,
  requestTimeout: 25000,
  enforceRequestTimeout: false,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
})
