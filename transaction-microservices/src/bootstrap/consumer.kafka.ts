import { config } from '../config';
import { Consumer, ConsumerSubscribeTopics, Kafka, EachMessagePayload } from 'kafkajs'

export default class ConsumerFactory {
  private kafkaConsumer: Consumer
  public callbackRecived: Function | undefined;

  public constructor() {
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [config.kafkaTopicAntifraud],
      fromBeginning: false
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      console.log('connected and subscribe the consumer');
      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload
          if( this.callbackRecived !== undefined) {
            this.callbackRecived(message);
          }
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`TRANSACTION_SERVICE- ${prefix} ${message.key}#${message.value}`)
        }
      })
      console.log('consumer RUN');
    } catch (error) {
      console.log('Error: ', error)
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