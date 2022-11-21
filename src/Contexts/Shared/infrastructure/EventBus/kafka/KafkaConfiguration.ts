const { Kafka } = require('kafkajs')

//Init and register Nats configuration
export class KafkaConfiguration {
  private readonly kafka: any;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'financial-transaction',
      brokers: ['localhost:9092']
    })
  }

  getConnection(): any {
    return this.kafka;
  }
}
