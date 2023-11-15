import { TransactionStatus } from '@prisma/client'

import { consumer } from '../services/kafka.service'
import { transactionUpdatedPayload } from '../types/transaction.types'
import { KAFKA_TOPIC_TRANSACTION_UPDATED } from '../utils/constants.utils'
import { updateTransactionStatus } from '../controllers/transaction.controller'


export async function start() {
  await consumer.subscribe({ topic: KAFKA_TOPIC_TRANSACTION_UPDATED, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic !== KAFKA_TOPIC_TRANSACTION_UPDATED) {
        console.error('Invalid topic')
        return
      }
      
      const payload = JSON.parse(message.value?.toString() || '{}') as transactionUpdatedPayload

      if (!payload.uuid) {
        console.error('Invalid payload: uuid is required')
        return
      }

      if (!payload.status) {
        console.error('Invalid payload: value is required')
        return
      }

      await updateTransactionStatus(payload.uuid, payload.status as TransactionStatus)
    }
  })
}
