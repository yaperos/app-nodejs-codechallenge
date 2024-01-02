import { Kafka, Consumer, logLevel, EachMessagePayload } from "kafkajs";

export class KafkaConsumerService {

  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly clientId: string,
    private readonly brokers: Array<string>,
    private readonly topic: string
  ) {
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      logLevel: logLevel.ERROR
    });
    this.consumer = this.kafka.consumer({ groupId: `${clientId}-group-0` });
  }

  async run () {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run({
      // eachBatch: async ({ batch }) => {
      //   console.log(batch)
      // },
      eachMessage: async(payload: EachMessagePayload) => {
        const { topic, partition, message } = payload
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        console.log(`- ${prefix} ${message.key}#${message.value}`)
      },
    })
  }

  async stop () {
    await this.consumer.stop()
    await this.consumer.disconnect()
  }
}