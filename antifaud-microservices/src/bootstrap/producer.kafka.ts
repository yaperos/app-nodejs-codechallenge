import { config } from '../config';
import { Kafka, Partitioners, Producer, TopicMessages } from 'kafkajs';
import { AntifraudInterface } from '../../src/Interfaces/antifraud.interface'

interface CustomMessageFormat { a: string }

export default class ProducerFactory {
  private producer: Producer

  constructor() {
    this.producer = this.createProducer()
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect()
      console.log('connected the producer');
    } catch (error) {
      console.log('Error connecting the producer: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }

  public async send(message: AntifraudInterface): Promise<void> {

    const topicMessages: TopicMessages = {
      topic: config.kafkaTopicAntifraud,
      messages: [{ value: JSON.stringify(message) }]
    }

    await this.producer.send(topicMessages)
  }

  private createProducer() : Producer {
    const kafka = new Kafka({
      clientId: 'producer-antifraud-client',
      brokers: ['localhost:9092'],
    })

    return kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
  }
}