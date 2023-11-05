import { Kafka } from 'kafkajs'
import { environmentVariables } from '../config/index'

export const KafkaTools = {
  instanceKafka () {
    const kafka = new Kafka({
      clientId: environmentVariables.kafka.client_id,
      brokers: environmentVariables.kafka.brokers
    })

    return kafka
  }
}
