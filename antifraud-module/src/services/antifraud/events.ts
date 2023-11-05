import { MessageKeys } from '../../constants/message-queue.constants'
import { type Transaction } from '../../interfaces/ITransactions'
import { subscribeMessageQueueManager } from '../../providers/message-broker-consumer.provider'
import { environmentVariables } from '../../config/index'

const verifyTransaction = async function manageTransaction (data: Transaction): Promise<void> {
  try {
    if (data.value > 1000) {
      console.log('Transaction rejected')
    }

    console.log('Transaction accepted')
  } catch (error) {}
}

subscribeMessageQueueManager({
  function: verifyTransaction,
  messageKey: MessageKeys.TRANSACTION_CREATED,
  topic: environmentVariables.kafka.transaction_topic
})
