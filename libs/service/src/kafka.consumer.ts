import { Kafka, Consumer, logLevel, EachMessagePayload, EachMessageHandler } from "kafkajs"
import random from "lodash.random"

export class KafkaConsumerService {

  private kafka: Kafka
  private consumer: Consumer
  private eachMessage: EachMessageHandler = async (payload: EachMessagePayload) => {}

  constructor(
    private readonly topic: string,
    private readonly brokers: Array<string>,
  ) {
    this.kafka = new Kafka({
      clientId: `${topic}-consumer-client-${random(1, 2, true)}`,
      brokers: this.brokers,
      logLevel: logLevel.ERROR
    })
    this.consumer = this.kafka.consumer({ groupId: `${topic}-group-${random(1, 2, true)}` })
  }

  setEachMessageHandler(eachMessage: EachMessageHandler) { 
    this.eachMessage = eachMessage
  }

  async run () {
    await this.consumer.connect()
    await this.consumer.subscribe({ topic: this.topic })
    return this.consumer.run({
      eachMessage: this.eachMessage
    })
  }

  async stop () {
    await this.consumer.stop()
    await this.consumer.disconnect()
  }
}