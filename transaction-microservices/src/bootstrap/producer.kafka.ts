import { config } from '../config';
import { Kafka, Partitioners, Producer, RecordMetadata, TopicMessages } from 'kafkajs';
import { Transaction } from '../models';

export default class ProducerFactory {
  private producer: Producer
  private topic: string
  public sendResult!: RecordMetadata[]

  constructor(topic: string) {
    this.topic = topic;
    this.producer = this.createProducer()
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      // error
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }

  public async send(message: Transaction): Promise<void> {

    const topicMessages: TopicMessages = {
      topic: this.topic,
      messages: [{ value: JSON.stringify(message) }]
    }

    this.sendResult = await this.producer.send(topicMessages)
  }

  private createProducer() : Producer {
    const kafka = new Kafka({
      clientId: 'producer-transaction-client',
      brokers: ['localhost:9092'],
    })

    return kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
  }
}