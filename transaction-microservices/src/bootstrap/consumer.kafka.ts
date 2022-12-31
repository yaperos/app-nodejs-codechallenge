import { config } from '../config';
import { Consumer, ConsumerSubscribeTopics, Kafka, EachMessagePayload } from 'kafkajs'
import { AntifraudInterface } from '../Interfaces/antifraud.interface';

export default class ConsumerFactory {
  private kafkaConsumer: Consumer
  public callbackRecived: Function | undefined;
  private topic: string

  public constructor(topic: string) {
    this.topic = topic;
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.topic],
      fromBeginning: true
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload
          if( this.callbackRecived !== undefined) {
            const data:AntifraudInterface = message.value ? JSON.parse(message.value.toString()) : undefined;
            await this.callbackRecived(data);
          }
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`TRANSACTION_SERVICE- ${prefix} ${message.key}#${message.value}`)
        }
      })
    } catch (error) {
      // error
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({ 
      clientId: 'consumer-transaction-client',
      brokers: ['localhost:9092']
    })
    const consumer = kafka.consumer({ groupId: 'consumer-antifraud-group' })
    return consumer
  }
}