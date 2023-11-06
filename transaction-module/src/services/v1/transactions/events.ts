import { environmentVariables } from '../../../config/index'
import { MessageKeys } from '../../../constants/message-queue.constants'
import { TransactionStatus } from '../../../constants/transactions-status.constants'
import { type MessageBrokerTransactionResponse } from '../../../interfaces/ITransactions'
import { subscribeMessageQueueManager } from '../../../providers/message-broker-consumer.provider'

import * as hooks from './hooks'

const transactionStatusHandler = async function manageTransaction (data: MessageBrokerTransactionResponse): Promise<void> {
  try {
    if (data.status === TransactionStatus.APPROVED) {
      console.log('Transaction approved')
      await hooks.updateTransactionStatus({ ...data, status: TransactionStatus.APPROVED })
    }

    if (data.status === TransactionStatus.REJECTED) {
      await hooks.updateTransactionStatus({ ...data, status: TransactionStatus.REJECTED })
      console.log('Transaction rejected')
    }

    console.error('Transaction was not processed', data)
  } catch (error) {}
}

subscribeMessageQueueManager({
  function: transactionStatusHandler,
  messageKey: MessageKeys.TRANSACTION_STATUS_CHANGED,
  topic: environmentVariables.kafka.transaction_topic
})
