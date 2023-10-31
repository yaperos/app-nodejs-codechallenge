import { type Consumer, Kafka, type Producer } from 'kafkajs'
import { MessageManager } from '../messageManager'
import { type EventMessage } from '../../../shared/interfaces/eventMessage.interface'
import { logger } from '../../../shared/imports'

export class KafkaMessageManagerInstance extends MessageManager {
  private readonly _location: string = 'KafkaMessageManagerInstance.ts'
  private readonly _configuration: Kafka
  private readonly _producer: Producer
  private readonly _consumer: Consumer

  constructor (groupId: string, topic: string) {
    const { KAFKA_BROKER, KAFKA_MAX_RETRIES } = process.env
    const broker: string = KAFKA_BROKER ?? 'localhost:9092'
    const maxRetries: number = KAFKA_MAX_RETRIES !== undefined ? parseInt(KAFKA_MAX_RETRIES) : 3
    super(groupId, topic)
    this._configuration = new Kafka({
      clientId: 'transaction-service',
      brokers: [broker]
    })
    this._producer = this._configuration.producer()
    this._consumer = this._configuration.consumer({ groupId, maxInFlightRequests: maxRetries })
  }

  public async produce<T>(message: EventMessage<T>): Promise<void> {
    try {
      logger.logDebug(`Sending message: ${message as any}}`)
      await this._producer.connect()
      await this._producer.send({
        topic: super.topic,
        messages: [{
          key: message.key,
          value: JSON.stringify(message.value)
        }]
      })
      logger.logDebug('Message sent', this._location)
    } catch (error) {
      logger.logError(error, this._location)
    } finally {
      await this._producer.disconnect()
    }
  }

  public async consume (it: () => Promise<void>): Promise<void> {
    try {
      await this._consumer.connect()
      await this._consumer.subscribe({ topic: super.topic, fromBeginning: true })
      await this._consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            await it()
          } catch (error) {
            logger.logError(error, this._location)
          } finally {
            await this._consumer.commitOffsets([{ topic, partition, offset: message.offset }])
          }
        }
      })
    } catch (error) {
      logger.logError(error, this._location)
    }
  }
}
