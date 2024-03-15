import { kafka } from '@/lib/kafka'
import { Consumer } from 'kafkajs'

const topic = process.env.TOPIC
const app = process.env.APP_NAME

export const consumer = async (): Promise<Consumer> => {
  const newConsumer = kafka.consumer({ groupId: `${app}` })

  await newConsumer.connect()
  await newConsumer.subscribe({ topic, fromBeginning: true })

  return newConsumer
}
