import { Kafka, Producer, Consumer } from 'kafkajs'
import { EnvConfig } from '../core/utils/env-config'
import { logger } from '../core/utils/logger'
import { Bootstrap } from './bootstrap'

export class BrokerBootstrap implements Bootstrap {
  static pruducer: Producer
  static consumer: Consumer

  initialize(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      try {
        const { kafkaHost, kafkaClientId, kafkaGroupId } = EnvConfig
        const kafka = new Kafka({
          clientId: kafkaClientId,
          brokers: [kafkaHost],
        })
        BrokerBootstrap.pruducer = kafka.producer()
        BrokerBootstrap.consumer = kafka.consumer({ groupId: kafkaGroupId })

        logger.info('📫 Broker Client ready')

        resolve(true)
      } catch (error) {
        logger.info(' Broker failed to connect')

        reject(error)
      }
    })
  }
}
