import { BrokerBootstrap } from '../../bootstrap/broker.bootstrap'
import { EnvConfig } from '../../core/utils/env-config'
import { logger } from '../../core/utils/logger'
import { BrokerRepository } from '../domain/repositories/broker.repository'

export class BrokerInfrastructure implements BrokerRepository {
  kafkaTopic: string
  constructor() {
    this.kafkaTopic = EnvConfig.kafkaTopic
  }
  async send(payload: unknown): Promise<void> {
    const messageBuffer = Buffer.from(JSON.stringify(payload))

    await BrokerBootstrap.pruducer.connect()
    const send = await BrokerBootstrap.pruducer.send({
      topic: this.kafkaTopic,
      messages: [{ value: messageBuffer }],
    })

    logger.info(`messages sent: ${send}`)

    await BrokerBootstrap.pruducer.disconnect()
  }
  async receive(): Promise<void> {
    await BrokerBootstrap.consumer.connect()
    await BrokerBootstrap.consumer.subscribe({ topic: this.kafkaTopic, fromBeginning: true })
    await BrokerBootstrap.consumer.run({
      eachMessage: async ({ message }) => {
        const receivedMessage = JSON.parse(message.toString())
        logger.info(receivedMessage)
      },
    })
  }
}
