import { environmentVariables } from '../../../config/index'
import { TransactionsDao } from '../../../models/transactions/transactions.dao'
import { type MessageBrokerTransactionResponse } from '../../../interfaces/ITransactions'
import { MessageQueueProducer } from '../../../providers/message-broker-producer.provider'
import { TransactionStatusDao } from '../../../models/transaction-status/transaction-status.dao'

export const sendMessageToMessageQueue = async (messageQueueOperation: string, data: any): Promise<void> => {
  try {
    const kafka = MessageQueueProducer.getInstance()

    await kafka.sendMessage({
      topic: environmentVariables.kafka.transaction_topic,
      messages: [{ key: messageQueueOperation, value: JSON.stringify(data) }]
    })

    console.log(`Message sent to Message Queue topic: ${messageQueueOperation}`)
  } catch (error) {
    console.log(error)
  }
}

export const updateTransactionStatus = async (data: MessageBrokerTransactionResponse): Promise<void> => {
  const aTransactionsDao = new TransactionsDao()

  const aTransactionStatusDao = new TransactionStatusDao()

  const transactionStatus = await aTransactionStatusDao.getOne({ name: data.status })
  await aTransactionsDao.update({ transaction_id: data.transaction_id }, { transaction_status_id: transactionStatus.transaction_status_id })

  console.log('Transaction status updated')
}
