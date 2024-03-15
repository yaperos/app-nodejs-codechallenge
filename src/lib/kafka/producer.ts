import { Partitioners } from 'kafkajs'
import { kafka } from '.'
import Logger from '@/lib/log/logger'

export const producer = async () => {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
    allowAutoTopicCreation: false,
    transactionTimeout: 30000,
  })

  await producer.connect()

  return producer
}

producer().catch(Logger.error)
