import { environmentVariables } from '../../../config/index'
import { MessageQueueProducer } from '../../../providers/message-broker-producer.provider'

export const sendMessageToMessageQueue = async (messageQueueOperation: string, data: any): Promise<void> => {
  try {
    const kafka = MessageQueueProducer.getInstance()

    await kafka.sendMessage({
      topic: environmentVariables.kafka.transaction_topic,
      messages: [{ key: messageQueueOperation, value: JSON.stringify(data) }]
    })

    console.log({ key: messageQueueOperation, value: JSON.stringify(data) })

    console.log(`Message sent to Message Queue topic: ${messageQueueOperation}`)
  } catch (error) {
    console.log(error)
  }
}
