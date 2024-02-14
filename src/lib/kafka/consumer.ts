
import { consumerTransactionCreate, consumerTransactionApproved, consumerTransactionRejected } from '../../controllers/transaction/consumer.kafka' 
import { kafka } from '.'


const app = process.env.APP_NAME || ''

export const consumer = async (): Promise<void> => {
  const consumerCreate = kafka.consumer({ groupId: `${app}-create` })
  const consumerApproved = kafka.consumer({ groupId: `${app}-approved` })
  const consumerRejected = kafka.consumer({ groupId: `${app}-rejected` })
  await consumerTransactionCreate(consumerCreate)
  await consumerTransactionApproved(consumerApproved)
  await consumerTransactionRejected(consumerRejected)
}
