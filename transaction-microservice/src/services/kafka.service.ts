import { Kafka } from 'kafkajs'

import { KAFKA_CLIENT_ID, KAFKA_BROKER, KAFKA_GROUP_ID } from '../utils/constants.utils'


export const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER]
})

// Producer

export const producer = kafka.producer()

try {
  await producer.connect()
  console.log('Kafka producer connected')
} catch (error) {
  console.error('Error connecting Kafka producer:', error)
  process.exit(1)
}

export async function disconnectProducer() {
    try {
        await producer.disconnect()
        console.log('Kafka producer disconnected')
    } catch (error) {
        console.error('Error disconnecting Kafka producer:', error)
        process.exit(1)
    }
}

// Consumer

export const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID })

try {
    await consumer.connect()
    console.log('Kafka consumer connected')
} catch (error) {
    console.error('Error connecting Kafka producer:', error)
    process.exit(1)
}
