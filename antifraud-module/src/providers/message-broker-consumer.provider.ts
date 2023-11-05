/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type EachMessagePayload, type Consumer } from 'kafkajs'

import { KafkaTools } from '../tools/kafka.tools'
import { environmentVariables } from '../config/index'
import { type SubscribeMessageManagerDTO } from '../interfaces/IMessageBroker'

const messageManagers: Record<string, (data: any) => {}> = {}

export const subscribeMessageQueueManager = (data: SubscribeMessageManagerDTO) => {
  messageManagers[`${data.topic}_${data.messageKey}`] = data.function
}

const handleMessages = async ({ topic, message }: EachMessagePayload): Promise<void> => {
  if (!message.value) {
    return
  }

  const messageKey = message.key?.toString()
  const messageValue = JSON.parse(message.value?.toString())

  if (!!messageManagers[`${topic}_${messageKey}`] && Object.getOwnPropertyNames(messageValue).length !== 0) {
    console.log(`Consumer received message: ${messageKey}`)
    messageManagers[`${topic}_${messageKey}`](messageValue)
  }
}

export class MessageQueueConsumer {
  private static instance: MessageQueueConsumer

  private readonly consumerMessageQueue: Consumer

  private consumerIsConnected: boolean = false

  private constructor () {
    const kafka = KafkaTools.instanceKafka()

    this.consumerMessageQueue = kafka.consumer({ groupId: 'consumer' })
    void this.connectConsumer()
  }

  public static getInstance (): MessageQueueConsumer {
    if (!MessageQueueConsumer.instance) {
      MessageQueueConsumer.instance = new MessageQueueConsumer()
    }

    return MessageQueueConsumer.instance
  }

  public static start (): MessageQueueConsumer {
    return MessageQueueConsumer.getInstance()
  }

  async connectConsumer (): Promise<void> {
    if (!this.consumerIsConnected) {
      await this.consumerMessageQueue.connect()
      await this.consumerMessageQueue.subscribe({ topic: environmentVariables.kafka.transaction_topic })

      this.consumerIsConnected = true
      this.consumerMessageQueue.on('consumer.connect', () => {
        console.log('Consumer connected to the message queue')
      })
      this.consumerMessageQueue.on('consumer.disconnect', () => {
        console.log('Consumer connected to the message queue')
      })

      await this.consumerMessageQueue.run({ eachMessage: handleMessages })
    }
  }
}

export const messageQueueConsumer = MessageQueueConsumer.getInstance()
