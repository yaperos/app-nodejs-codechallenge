import { BrokerBootstrap } from '../../bootstrap/broker.bootstrap'
import { TransactionEventInput } from '../domain/entities/transaction-event-input.entity'
import { EnvConfig } from '../../core/utils/env-config'
import { logger } from '../../core/utils/logger'
import { BrokerRepository } from '../domain/repositories/broker.repository'
import { TransactionEventOutput } from '../domain/entities/transaction-event-output.entity'
import { TransactionStatusEnum } from './interface/dtos/enums/transaction-status.enum'

export class BrokerInfrastructure implements BrokerRepository {
  kafkaTopicAntifraud: string
  kafkaTopicTransac: string
  constructor() {
    this.kafkaTopicAntifraud = EnvConfig.kafkaTopicAntifraud
    this.kafkaTopicTransac = EnvConfig.kafkaTopicTransac
  }
  async send(payload: unknown): Promise<void> {
    const messageBuffer = Buffer.from(JSON.stringify(payload))

    await BrokerBootstrap.pruducer.connect()
    await BrokerBootstrap.pruducer.send({
      topic: this.kafkaTopicTransac,
      messages: [{ value: messageBuffer }],
    })

    logger.info(`message sent: ${messageBuffer}`)

    await BrokerBootstrap.pruducer.disconnect()
  }
  async receive(): Promise<void> {
    await BrokerBootstrap.consumer.connect()
    await BrokerBootstrap.consumer.subscribe({ topic: this.kafkaTopicAntifraud, fromBeginning: true })
    await BrokerBootstrap.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.info(`message received => topic: ${topic}, partition: ${partition}, offset: ${message.offset}`)

        const inputMessage = message?.value?.toString() || ''
        const { transactionExternalId, value } = <TransactionEventInput>JSON.parse(inputMessage)
        let payload: TransactionEventOutput

        if (value > 1000) {
          payload = { status: TransactionStatusEnum.REJECTED, transactionExternalId }
          await this.send(payload)
        } else {
          payload = { status: TransactionStatusEnum.APPROVED, transactionExternalId }
          await this.send(payload)
        }
      },
    })
  }
}
