import { environmentVariables } from '../../config/index'
import { type Transaction } from '../../interfaces/ITransactions'
import { MessageKeys } from '../../constants/message-queue.constants'
import { TransactionStatus } from '../../constants/transactions-status.constants'
import { subscribeMessageQueueManager } from '../../providers/message-broker-consumer.provider'

import * as hooks from './hooks'

const verifyTransaction = async function manageTransaction (data: Transaction): Promise<void> {
  try {
    if (data.value > 1000) {
      console.log('Transaction rejected')
      await hooks.sendMessageToMessageQueue(MessageKeys.TRANSACTION_STATUS_CHANGED, { ...data, status: TransactionStatus.REJECTED })
      return
    }

    console.log('Transaction accepted')
    await hooks.sendMessageToMessageQueue(MessageKeys.TRANSACTION_STATUS_CHANGED, { ...data, status: TransactionStatus.APPROVED })
  } catch (error) {}
}

subscribeMessageQueueManager({
  function: verifyTransaction,
  messageKey: MessageKeys.TRANSACTION_CREATED,
  topic: environmentVariables.kafka.transaction_topic
})
