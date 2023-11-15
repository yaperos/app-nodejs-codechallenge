import { consumer } from '../services/kafka.service'
import { transactionCreatedPayload } from '../types/transaction.types'
import { KAFKA_TOPIC_TRANSACTION_CREATED } from '../utils/constants.utils'
import { transactionCreatedController } from '../controllers/transaction.controller'


export async function start() {
  await consumer.subscribe({ topic: KAFKA_TOPIC_TRANSACTION_CREATED, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic !== KAFKA_TOPIC_TRANSACTION_CREATED) {
        console.error('Invalid topic')
        return
      }

      const payload = JSON.parse(message.value?.toString() || '{}') as transactionCreatedPayload

      if (!payload.uuid) {
        console.error('Invalid payload: uuid is required')
        return
      }

      if (!payload.value) {
        console.error('Invalid payload: value is required')
        return
      }
      
      await transactionCreatedController(payload.uuid, payload.value)
    }
  })
}
