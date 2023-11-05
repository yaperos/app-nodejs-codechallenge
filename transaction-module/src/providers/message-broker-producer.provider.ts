/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RecordMetadata, type Producer, type ProducerRecord } from 'kafkajs'

import { KafkaTools } from '../tools/kafka.tools'

export class MessageQueueProducer {
  private static instance: MessageQueueProducer

  private readonly messageQueueProducer: Producer

  private producerIsConnected: boolean = false

  private constructor () {
    const kafka = KafkaTools.instanceKafka()

    this.messageQueueProducer = kafka.producer()
  }

  public static getInstance (): MessageQueueProducer {
    if (!MessageQueueProducer.instance) {
      MessageQueueProducer.instance = new MessageQueueProducer()
    }

    return MessageQueueProducer.instance
  }

  public get isConnected (): boolean {
    return this.producerIsConnected
  }

  async connect (): Promise<void> {
    await this.messageQueueProducer.connect()
    this.producerIsConnected = true
  }

  get producer (): Producer {
    return this.messageQueueProducer
  }

  async sendMessage (record: ProducerRecord): Promise<RecordMetadata[]> {
    if (!this.producerIsConnected) {
      await this.connect()
    }

    return await this.messageQueueProducer.send(record)
  }
}
