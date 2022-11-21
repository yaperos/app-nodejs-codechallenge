const { Kafka } = require('kafkajs')

export class KafkaEvents {
  private readonly kafka: any;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'financial-transaction',
      brokers: ['localhost:9092']
    })
  }

  async publish(topic: string, data: any): Promise<void> {
    const producer = this.kafka.producer()
    await producer.connect()
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(data) }
      ],
    })

    await producer.disconnect()
  }
  async subscribe(): Promise<any> {
    const consumer = this.kafka.consumer({ groupId: 'TRANSACTION-GROUP' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'TRANSACTION_CREATED', fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }: { topic: any; partition: any; message: any }) => {
        console.log(JSON.parse(message.value))
      },
    })
  }
}
