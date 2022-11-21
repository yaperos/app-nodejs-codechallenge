import Configuration from "../../../../../apps/transaction/backend/config";

const { Kafka } = require('kafkajs')

export class KafkaConfiguration {
  private readonly kafka: any;

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'financial-transaction',
      brokers: [`${Configuration.KAFKA_BROKER}`]
    })
  }

  getConnection(): any {
    return this.kafka;
  }
}
